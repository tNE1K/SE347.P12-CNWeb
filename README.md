Thành viên nhóm 22  
21522604 - Phùng Nam Thanh  
21520604 - Huỳnh Gia Bảo  
21521023 - Nguyễn Đức Trung Kiên  
21522122 - Nông Mạnh Hùng  
22520036 - Vũ Đình An  

Các bước setup:  
- Git clone Code from GitHub  
  
- Tạo file .env có nội dung sau trong thư mục /back  
  
JWT_SECRET=   
SECRET_KEY =  
CONFIRM_SECRET =  
MONGO_URI =  
AZURE_STORAGE_CONNECTION_STRING=  
API_HOSTNAME =   
API_URL =   
  
- Tạo file .env có nội dung sau trong thư mục /front  
  
MY_API_URL=  
  
- Tạo môi trường ảo cho backend và chạy backend server  
cd .\back\  
py -m venv venv  
.\venv\Scripts\activate  
pip install -r .\requirements.txt  
py .\app.py  
- Tải dependency và chạy frontend  
cd .\front\  
npm install --legacy-peer-deps
npm run dev

- Tùy chọn domain cho web qua 2 file ./back/.env và file ./front/.env

Truy cập vào localhost:3000
