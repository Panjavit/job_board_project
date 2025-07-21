import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:5001/api' // URLของBackend
});

//Interceptor"ดักจับ"ทุกRequestเพื่อแนบTokenไปในHeaderทำให้เราไม่ต้องเขียนโค้ดใส่Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); //ดึงTokenที่เราจะบันทึกไว้ใน localStorage
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`; //ถ้ามีTokenให้เพิ่มHeader 'Authorization' เข้าไป
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response, // ถ้าสำเร็จ ก็ส่ง response กลับไปปกติ
    (error) => {
        //ถ้าเกิด Error และมี status เป็น 401
        if (error.response && error.response.status === 401) {
            // บ token และ redirect ไปหน้า login
            localStorage.removeItem('token');
            //ใช้ window.location.href เพื่อให้แน่ใจว่า state จะถูกรีเซ็ตทั้งหมด
            window.location.href = '/auth/employee/login';
        }
        return Promise.reject(error);
    }
);

export default api;