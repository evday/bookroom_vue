import axios from 'axios';
import routes from '../router'


let base = 'http://127.0.0.1:8081';

axios.interceptors.request.use(config => { 

	if(window.localStorage.getItem('user')){
		let userData = JSON.parse(window.localStorage.getItem('user'));
		config.headers['Authorization'] =userData.token;
	}
	return config;
}, error => {
	return Promise.reject(error);
});


// 添加一个响应拦截器
axios.interceptors.response.use( response => {
	if(response.data.code == 1005){//token过期
		window.localStorage.removeItem('user');
		location.reload();
		routes.push({
			path: '/'
		});
	}
	// if (response.data.code == 403){
	// 	alert(response.data.message)
	// }
	return response;
}, error => {
	alert(error);
	return Promise.reject(error);
});
//格式化时间
export const formateTime = params =>{
	
	var d = new Date(params);
	var nowYear = d.getFullYear().toString()
	var nowMonth = (d.getMonth() + 1).toString()
	var nowDay = d.getDate().toString();
	var nowHours = d.getHours().toString(); 
	var nowMin = d.getMinutes().toString(); 

	function timeAdd0(str) {
		if(str.length<=1){
			str='0'+str;
		}
		return str
	}
	nowYear=timeAdd0(nowYear)
	nowMonth=timeAdd0(nowMonth)
	nowDay=timeAdd0(nowDay)
	nowHours=timeAdd0(nowHours)
	nowMin=timeAdd0(nowMin)

	var times = nowYear + '-' + nowMonth + '-' + nowDay + ' ' + nowHours + ':' + nowMin; 

	return times
}

export const requestLogin = params => {return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserListPage = params => {return axios.get(`${base}/v1/user`, { params: params }).then(res => res.data); };

export const removeUser = params => {return axios.delete(`${base}/v1/user/`+params.id).then(res =>res.data);}

export const addUser = params => {return axios.post(`${base}/v1/user`,params);}

export const addEquipment = params => {return axios.post(`${base}/v1/equip`,params);}

export const getAllEquipment = params => {return axios.get(`${base}/v1/equip`,params);}

export const removeEquip = params => {return axios.delete(`${base}/v1/equip/`+params.id).then(res =>res.data);}

export const editEquipment = params => {return axios.put(`${base}/v1/equip/`+params.id,params).then(res =>res.data);}

export const searchEquipment = params => {return axios.get(`${base}/v1/equip/`+params.keyword).then(res =>res.data);}

export const createRoom = params => {return axios.post(`${base}/v1/room`,params);}

export const getAllRoom = params => {return axios.get(`${base}/v1/room`,params);}

export const removeRoom = params => {return axios.delete(`${base}/v1/room/`+params.id).then(res =>res.data);}

export const editRoom = params => {return axios.put(`${base}/v1/room/`+params.id,params).then(res =>res.data);}

export const searchRoom = params => {return axios.get(`${base}/v1/room/`+params.keyword).then(res =>res.data);}

export const addMeet = params => {return axios.post(`${base}/v1/meet`,params);}

export const getAllMeetInfo = params => {return axios.get(`${base}/v1/meet`,params)}

export const removeMeetInfo = params => {return axios.delete(`${base}/v1/meet/${params.id}/${params.username}`).then(res =>res.data);}

export const editMeetInfo = params => {return axios.put(`${base}/v1/meet/`+params.id,params).then(res =>res.data);}

export const searchMeetInfo = params => {return axios.get(`${base}/v1/meet/${params.s}/${params.e}/${params.roomsid}`).then(res=>res.data);}
