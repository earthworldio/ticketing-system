# 🚀 ขั้นตอนการ Deploy บน Railway (ต่อจากที่ทำไว้)

## ✅ ที่ทำไปแล้ว
- ✅ สร้าง PostgreSQL database
- ✅ Deploy โปรเจค (กำลัง building)

---

## 📝 ขั้นตอนที่เหลือ

### 1. รอให้ Build เสร็จ
- รอจนกว่าสถานะ `ticketing-system` จะเป็น **Active** (เครื่องหมายถูกสีเขียว)
- ถ้า build failed ให้ดู logs และแจ้งกลับมา

### 2. เชื่อมต่อ Database กับ Application

**ขั้นตอน:**
1. คลิกที่ **Postgres** service (ช่องซ้าย)
2. ไปที่แท็บ **Variables** ข้างบน
3. เลื่อนลงมาจนเห็นส่วน **Reference Variables**
4. คลิกปุ่ม **+ New Reference** 
5. เลือก `ticketing-system` service
6. Railway จะเพิ่ม `DATABASE_URL` ให้อัตโนมัติ

**หรือวิธีที่ 2:**
1. คลิกที่ **ticketing-system** service
2. ไปที่แท็บ **Variables**
3. คลิก **+ New Variable**
4. คลิก **Add Reference** 
5. เลือก `DATABASE_URL` จาก Postgres service

### 3. ตั้งค่า Environment Variables

ในแท็บ **Variables** ของ `ticketing-system` service:

คลิก **+ New Variable** และเพิ่มทีละตัว:

```
JWT_SECRET
```
Value: (ใช้คำสั่งด้านล่างสร้าง)

```
JWT_EXPIRES_IN
```
Value: `7d`

```
NODE_ENV
```
Value: `production`

#### 🔐 สร้าง JWT_SECRET:

**บน macOS/Linux:**
```bash
openssl rand -hex 64
```

**หรือใช้ Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy ค่าที่ได้มาใส่ใน `JWT_SECRET`

### 4. Restart Service

หลังจากตั้งค่า Variables เสร็จ:
1. ไปที่แท็บ **Settings** ของ `ticketing-system`
2. เลื่อนลงมาหาส่วน **Service**
3. คลิกปุ่ม **Restart**

### 5. Initialize Database Schema

**ตัวเลือก 1: รอให้ Auto Script ทำงาน (แนะนำ)**
- Script `init-db.js` จะรันอัตโนมัติหลัง deploy
- รอ 1-2 นาที แล้วดู logs ว่ามีข้อความ "Database schema created successfully!" หรือไม่

**ตัวเลือก 2: Run Manual (ถ้าตัวเลือก 1 ไม่ได้ผล)**

1. คลิกที่ **Postgres** service
2. ไปที่แท็บ **Data**
3. คลิกปุ่ม **Query** หรือ **psql**
4. Copy เนื้อหาทั้งหมดจากไฟล์ `schema.sql` ในโปรเจค
5. Paste และกด **Run Query**

### 6. Generate Public URL

1. คลิกที่ **ticketing-system** service
2. ไปที่แท็บ **Settings**
3. ในส่วน **Networking** หาปุ่ม **Generate Domain**
4. คลิก **Generate Domain**
5. Railway จะสร้าง URL ให้ เช่น `ticketing-system-production-xxxx.railway.app`

---

## 🎉 ทดสอบระบบ

1. เปิด URL ที่ได้จาก Generate Domain
2. Login ด้วย:
   - **Email:** `admin@example.com`
   - **Password:** `admin123`

3. ⚠️ **สำคัญ:** เข้าไปเปลี่ยนรหัสผ่าน admin ทันที!

---

## 🔍 ตรวจสอบ Logs

### ดู Application Logs:
1. คลิกที่ **ticketing-system** service
2. ไปที่แท็บ **Deployments**
3. คลิกที่ deployment ล่าสุด
4. ดู logs แบบ real-time

### ดูว่า Database Initialize สำเร็จหรือไม่:
ใน logs ควรเห็น:
```
Connected to database successfully
Database schema created successfully!
Default credentials:
  Email: admin@example.com
  Password: admin123
```

---

## ❌ แก้ปัญหา

### ปัญหา 1: Build Failed
- ดู logs ว่า error อะไร
- อาจต้อง push code ใหม่
- ลอง redeploy

### ปัญหา 2: Cannot connect to database
- ตรวจสอบว่าได้ Add Reference แล้ว (ขั้นตอนที่ 2)
- ตรวจสอบว่ามี `DATABASE_URL` ใน Variables
- Restart service

### ปัญหา 3: Tables not found / Login ไม่ได้
- Database ยังไม่ถูก initialize
- ทำขั้นตอนที่ 5 ด้วยตนเอง (Manual)
- ตรวจสอบว่ามีตาราง `user` ใน Database หรือยัง

### ปัญหา 4: 503 Service Unavailable
- รอ 2-3 นาที service อาจยัง start ไม่เสร็จ
- ดู logs ว่ามี error อะไร
- Restart service

---

## 📞 ต้องการความช่วยเหลือ?

แจ้งข้อความ error หรือสถานะที่เห็นมาได้เลย จะช่วยแก้ไขให้ครับ!

