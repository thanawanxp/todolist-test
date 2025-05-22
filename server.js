const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 4000;

// เชื่อมต่อ MySQL
const db = mysql.createConnection({
  host: "localhost", 
  user: "root", 
  password: "123456789", 
  database: "todo_list_test",
});

const cors = require("cors");
app.use(cors());


// ตรวจสอบการเชื่อมต่อ
db.connect((err) => {
  if (err) {
    console.error("ไม่สามารถเชื่อมต่อกับฐานข้อมูล:", err);
    return;
  }
  console.log("เชื่อมต่อกับฐานข้อมูล MySQL สำเร็จ");
});

// กำหนดให้ใช้ body-parser เป็น middleware ที่ช่วยแปลง JSON ที่อยู่ใน request body ทำให้ req.body สามารถใช้งานได้เป็น Object
// ถ้าไม่ใส่ req.body จะเป็น undefined ตอน POST หรือ PUT
app.use(bodyParser.json());

// API สำหรับดูรายการ To-Do ทั้งหมด
app.get("/todolist-all", (req, res) => {
  db.query("SELECT * FROM todo_list", (err, results) => {
    if (err) {
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลได้" });
      return;
    }
    res.status(200).json(results);
  });
});

// API สำหรับเพิ่ม To-Do
app.post("/add-todolist", (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: "กรุณาระบุรายการที่ต้องการเพิ่ม" });
  }

  db.query("INSERT INTO todo_list (task) VALUES (?)", [task], (err, results) => {
    if (err) {
      res.status(500).json({ error: "ไม่สามารถเพิ่มรายการได้" });
      return;
    }
    res.status(201).json({ id: results.insertId, task });
  });
});

// API สำหรับแก้ไข To-Do 
app.put("/edit-todolist/:id", (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ error: "กรุณาระบุข้อความที่ต้องการแก้ไข" });
  }

  db.query(
    "UPDATE todo_list SET task = ? WHERE id = ?",
    [task, id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "ไม่สามารถแก้ไขรายการได้" });
        return;
      }
      res.status(200).json({ id, task });
    }
  );
});

// API สำหรับทำเครื่องหมาย checkbox ว่ารายการเสร็จแล้ว
app.patch("/toggle-completed/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE todo_list SET completed = NOT completed WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "ไม่สามารถอัปเดตสถานะได้" });
        return;
      }
      res.status(200).json({ id, completed: results.changedRows > 0 });
    }
  );
});

// API สำหรับลบ To-Do
app.delete("/delete-todolist/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM todo_list WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "ไม่สามารถลบรายการได้" });
      return;
    }
    res.status(200).json({ message: "ลบรายการสำเร็จ" });
  });
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`เซิร์ฟเวอร์ทำงานที่ http://localhost:${port}`);
});
