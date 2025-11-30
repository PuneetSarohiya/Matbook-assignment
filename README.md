 # Project README

## Milestone 1 — Frontend Development

### Frontend Tech Stack
1. **React JS 19**
2. **Redux**
3. **Tailwind CSS**
4. **Ant Design** (Used due to Tachstack version issues)
5. **React Toastify**

---

### Frontend Features Implemented
1. All submission requirements fully completed  
2. Submission Table  
3. Add Submission Form  
4. Edit Submission Form  
5. View Submission Details Card  
6. Page size selector (10 / 20 / 30)  
7. Delete Submission  
8. Search submissions by Name and Submission ID 
9. Download CSV for all submissions  
10. Pagination implemented  
11. Display current page, total pages, and total submissions  
12. Full inline validation for all fields  
13. Submit button disabled until all mandatory fields are valid  

---

### Run Frontend
1. Node Version:22
2. Command:npm run start

---

## Milestone 2 — Backend Development

### Backend Tech Stack
1. **Node.js**
2. **Express.js**
3. **MongoDB**
4. **Custom Components / Helpers / BaseHelper**

---

### Backend APIs

#### Form APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/form/new` | Create a new dynamic form |
| GET | `/api/form/:id` | Fetch a dynamic form by ID |

---

#### Submission APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/submission/new` | Add a new submission |
| POST | `/api/submission/submission-list` | Fetch submissions list (pagination + search) |
| POST | `/api/submission/:id/update` | Update submission data |
| POST | `/api/submission/:id/remove` | Remove submission |

---

### Run Backend
1. Node Version:22
2. Command:npm run start