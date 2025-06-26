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

export default api;