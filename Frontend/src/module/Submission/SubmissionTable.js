import { useEffect, useState, useCallback } from "react";
import {
  Input,
  Spin,
  message,
  Table,
  Button,
  Space,
  Modal
} from "antd";
import dayjs from "dayjs";

import {
  FiPlus,
  FiEye,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiDownload
} from "react-icons/fi";

import "../styles/SubmissionTable.css";
import DynamicForm from "../Form/DynamicForm";
import SubmissionDetails from "./SubmissionDetails";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSubmissionsDetails, fetchSubmissionForm, submissionRemove } from "../Redux/AppAction";
import { fetchSubmissionFormDetails, fetchSubmissionsListDetails, fetchloadingState } from "../Redux/AppReducer";

const SubmissionTable = () => {
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(6);
  const [pageNum, setPageNum] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const isLoading = useSelector(state => fetchloadingState(state))
  const list = useSelector (state => fetchSubmissionsListDetails(state))
  const form = useSelector (state => fetchSubmissionFormDetails(state))
  const totalSubmissions = list?.total; 
  const totalPages = Math.ceil(totalSubmissions / pageSize);
  const paginatedData = list?.submissionList;

  const dispatch = useDispatch()

  const fetchData = (filter) => {
    dispatch(fetchAllSubmissionsDetails(filter))
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    let inputFilter = {
      filter: {
        pageNum: pageNum,
        pageSize: pageSize,
      }
    };
    fetchData(inputFilter)
  }, [pageNum]);

  useEffect(() => {
    dispatch(fetchSubmissionForm())
  }, []);

  useEffect(() => {
    // if (!searchText.trim()) {
    //   setPageNum(1);
    //   fetchData({
    //     filter: {
    //       pageNum: 1,
    //       pageSize,
    //       qtext: ""
    //     }
    //   });
    // } else {
      debouncedSearch(searchText);
    // }
  }, [searchText]);
  

  const debouncedSearch = useCallback(
    debounce((text) => {
      setPageNum(1);
      fetchData({
        filter: {
          pageNum: 1,
          pageSize,
          qtext: text
        }
      });
    }, 500),
    [pageSize]
  );
  
  const resetFilters = () => {
    setSearchText("");
    fetchData();
  };

  const downloadCSV = () => {
    if (!list?.submissionList || list?.submissionList?.length === 0) {
      message.warning("No data to download");
      return;
    }

    const headers = ["Full Name", "Submission ID", "Submitted At"];
    const rows = list?.submissionList?.map((item) => [
      item.data?.fullName || "",
      item.data?.matBook_id || "",
      dayjs(item.createdAt).format("YYYY-MM-DD hh:mm A") || ""
    ]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";

    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `submissions_${dayjs().format("YYYYMMDD_HHmmss")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const submissionDelete =(id) => {
    dispatch(submissionRemove(id))
  }
  
  const columns = [
    {
      title: <b>Full Name</b>,
      dataIndex: ["data", "fullName"],
      key: "fullName"
    },
    {
      title: <b>Submission ID</b>,
      dataIndex: ["data", "matBook_id"]
    },
    {
      title: <b>Submitted At</b>,
      dataIndex: "createdAt",
      render: (value) => (
        <span style={{ color: "#777" }}>
          {dayjs(value).format("YYYY-MM-DD hh:mm A")}
        </span>
      )
    },
    {
      title: <b>Actions</b>,
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<FiEye size={16} />}
            onClick={() => {
              setViewData(record);
              setIsModalOpen(true);
            }}
          >
            View
          </Button>

          <Button
            type="primary"
            icon={<FiEdit size={16} />}
            onClick={() => {
              setEditData(record);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>

          <Button
            danger
            type="primary"
            icon={<FiTrash2 size={16} />}
            onClick={() => submissionDelete(record._id)}
          >
            Delete
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="form-wrapper">
      <h1 className="heading">Employee Onboarding</h1>
      <p className="subtext">
        Please fill out the form to onboard a new employee
      </p>

      <div className="search-card">
        <div className="search-row">
          <Input
            prefix={<FiSearch size={16} />}
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />

          <Space>
            <Button onClick={resetFilters}>Reset</Button>

            <Button icon={<FiDownload />} onClick={downloadCSV}>
              Download CSV
            </Button>

            <Button type="primary" icon={<FiPlus />} onClick={() => setIsModalOpen(true)}>
              Add Submission
            </Button>

            <div className="pagesize-wrapper">
              <span>Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageNum(1);
                  setPageSize(Number(e.target.value));
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
            </div>
          </Space>
        </div>

        <div className="page-info">
          <span>Current Page: {pageNum}</span>
          <span>Total Pages: {totalPages}</span>
          <span>Total Submissions: {totalSubmissions}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="loader">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          className="custom-table"
          dataSource={paginatedData}
          columns={columns}
          rowKey={(item) => item._id}
          pagination={{
            current: pageNum,
            pageSize,
            total: totalSubmissions,
            showSizeChanger: false,
            position: ["bottomCenter"],
            onChange: (page) => setPageNum(page),

            itemRender: (page, type, element) => {
              if (type === "prev") return <Button>Previous</Button>;
              if (type === "next") return <Button>Next</Button>;
              return element;
            }
          }}
        />
      )}

      <Modal
        title={
          viewData
            ? "View Submission"
            : editData
            ? "Edit Submission"
            : form?.result?.title
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setViewData(null);
          setEditData(null);
        }}
        footer={null}
        width={700}
        destroyOnClose
      >
      {viewData && <SubmissionDetails data={viewData} />}
        {!viewData && (
          <DynamicForm
            formData={form}
            editData={editData}
            onSuccess={() => {
              setIsModalOpen(false);
              setEditData(null);
              fetchData();
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default SubmissionTable;
