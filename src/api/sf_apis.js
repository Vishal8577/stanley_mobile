import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_ENDPOINT = 'https://test.salesforce.com/services/oauth2/token';
const BASE_URL = 'https://ondonte--dev.sandbox.my.salesforce.com/';

let tokenRetrievalAttempts = 0;
const maxTokenRetrievalAttempts = 3;

export const refreshAccessToken = () => {
  try {
    return axios
      .post(
        TOKEN_ENDPOINT,
        {
          client_id:
            '3MVG9Lu3LaaTCEgIZUddL0.m_4rAk6ek8RQJx85pY0jOimttfqhV8cC.w8StDfxm0LsIQ4s_rdWM66oTkyBYe',
          client_secret:
            '942B063CDC602AD8C433EC3E357E742C8BF6900C1BD22E1D79215A8FD1E20234',
          username: 'prithvi.shiroor-xnyw@force.com.dev',
          password: 'SFDC@Sand1234',
          grant_type: 'password',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then(response => {
        console.log('SFDC token response: ', response);
        if (response && response.data && response.data.access_token) {
          console.log('setting acces token');
          AsyncStorage.setItem('access_token', response.data.access_token);
        }
      })
      .catch(error => {
        console.error('Error refreshing access token:', error);

        // Increment the attempts counter
        tokenRetrievalAttempts++;

        // Check if the maximum number of attempts is reached
        if (tokenRetrievalAttempts < maxTokenRetrievalAttempts) {
          // Retry the token retrieval after a delay (optional)
          setTimeout(() => {
            refreshAccessToken();
          }, 500); // Adjust the delay as needed
        } else {
          console.error('Maximum token retrieval attempts reached');
          // Handle the error or take appropriate action
        }
      });
  } catch (e) {
    console.log('Error: ' + e);
  }
};

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  async config => {
    const accessToken = await AsyncStorage.getItem('access_token');
    config.headers['Authorization'] = `Bearer ${accessToken}`;
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => {
    // Handle request error
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle 401 unauthorized responses
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      console.log('--- inside request interceptors');
      // If the response status is 401, attempt to refresh the access token
      try {
        await refreshAccessToken();
        // Retry the original request after obtaining a new access token
        return api(error.config);
      } catch (refreshError) {
        // Handle the error from the refresh attempt
        console.error('Error refreshing access token:', refreshError);
        // Redirect to the login screen or handle the error as needed
        throw refreshError;
      }
    }
    // For other errors, just pass them through
    throw error;
  },
);

export const getCountryState = async () => {
  console.log(' ---------->  HITTING THE getCountryState API  <-----------');
  try {
    const response = await api.post('/services/apexrest/get_county_city');
    return response.data.response.cityCountyStateWrapper.cityCountyMap;
  } catch (e) {
    console.log('Error: ' + e);
  }
};
export const getSpecialskills = async () => {
  console.log(' ---------->  HITTING THE getCountryState API  <-----------');
  try {
    const response = await api.post('/services/apexrest/get_county_city');
    return response.data.response.cityCountyStateWrapper;
  } catch (e) {
    console.log('Error: ' + e);
  }
};

export const singup = async userData => {
  // console.log("data==========>",userData)
  console.log(' ---------->  HITTING THE SF SINGUP API  <-----------');
  try {
    return api.post('/services/apexrest/signup_candidate', userData);
  } catch (e) {
    console.log('Error: ' + e);
  }
};

export const getDocuments = async cid => {
  console.log('HITTING THE GET DOCUMENT APIS');
  try {
    const response = await api.get(
      `/services/apexrest/get_documents?cid=${cid}`,
    );
    return response.data;
  } catch (e) {
    console.log('Error: ' + e);
  }
};
export const getCandidateStatus = async cid => {
  console.log('HITTING THE getCandidateStatus APIS ', cid);
  try {
    const response = await api.post(
      `/services/apexrest/get_candidate_status?cid=${cid}`,
    );
    return response.data.response;
  } catch (e) {
    console.log('Error: ' + e);
  }
};

export const postDocuments = async documents => {
  console.log('HITTING THE POST DOCUMENT APIS');
  try {
    const response = await api.post(
      `/services/apexrest/document_submission`,
      documents,
    );
    return response.data;
  } catch (e) {
    console.log('Error: ' + e);
  }
};

export const getPermanentJobs = async (
  params
  // cid,
  // selectedState,
  // selectedCity,
  // selectedJobType,
) => {
  const {cid,selectedState,selectedCity,selectedJobType,county}=params
  console.log('HITTING THE GET PERMANENT JOBS APIS ', cid, ' ', selectedState);
  try {
    let url = `/services/apexrest/get_permanentjobs?cid=${cid}`;
    // console.log('selected State------->', selectedState);
    // console.log('selected City------->', selectedCity);
    // console.log('selected JobType-------->', selectedJobType);

    if (selectedState != null && selectedState.length > 0) {
      console.log('Adding state filter:', selectedState);
      url += `&state=${selectedState}`;
    }

    if (selectedCity != null && selectedCity.length > 0) {
      console.log('Adding city filter:', selectedCity);
      url += `&city=${selectedCity}`;
    }
    if (county != null && county.length > 0) {
      console.log('Adding county filter:', county);
      url += `&county=${county}`;
    }

    if (selectedJobType != null&& selectedJobType.length > 0) {
      console.log('Adding jobType filter:', selectedJobType);
      url += `&jobType=${selectedJobType}`;
    }
    else url+=`&state=${'state'}`
    console.log('hitting Url------>', url);
    const response = await api.get(url);
    // console.log('status======================',response?.data)
    return response.data;
  } catch (e) {
    console.log('Error: ' + e);
  }
};

export const getTemporaryJobs = async (params) => {
  const url=`services/apexrest/get_temp_jobs?${params}`
  console.log(url)
  //cid=${params.cid}&city=${params.city}&distance=${params.distance}&start_date=${params.start_date}&special_skill=Laser Certification&staff_type=DA`

  console.log('HITTING THE GET TEMPORARY JOBS APIS',params);
  try {
    const response = await api.get(url);
    return response.data;
  } catch (e) {
    console.log('Error: ' + e);
  }
};

export const applyTemporaryJobs = async (params) => {
  console.log('HITTING THE APPLY TEMPORARY JOBS APIS ', params.cid);
  try {
    const response = await api.post(
      `/services/apexrest/apply_temp_job?cid=${params.cid}`,
      params,
    );
    return response.data;
  } catch (e) {
    console.log('Error: ' + e);
  }
};
export const get_application_document = async (params) => {
  console.log('HITTING THE get_application_document APIS ', params);
  try {
    const response = await api.get(
      `/services/apexrest/get_application_document?cid=${params.cid}`
    );
    return response.data;
  } catch (e) {
    console.log('Error: ' + e);
  }
};
export const upload_application_document = async (params) => {
  console.log('HITTING THE upload_application_document APIS ', params);
  try {
    const response = await api.put(
      `/services/apexrest/upload_application_document?cid=${params.cid}`,
      params.params
    );
    return response.data;
  } catch (e) {
    console.log('Error: ' + e);
  }
};
export const get_withdraw_Application = async (params) => {
  console.log('HITTING THE upload_application_document APIS ', params);
  try {
    const response = await api.get(`/services/apexrest/get_withdraw_Application?cid=${params.cid}&jobAppId=${params.jobAppId}&status=Withdrawn by Candidate`
    );
    return response.data;
  } catch (e) {
    console.log('Error: ' + e);
  }
};

export const applyPermanentJobs = async (cid, job_req_id) => {
  console.log('HITTING THE APPLY PERMANENT JOBS APIS ', cid, ' ', job_req_id);
  try {
    const response = await api.post(
      `/services/apexrest/apply_permanent_job?cid=${cid}`,
      {job_req_id: job_req_id},
    );
    return response.data;
  } catch (e) {
    console.log('Error: ' + e);
  }
};

export const getDashboardData = async cid => {
  console.log('HITTING THE GET DASHBOARD APIS');
  try {
    const response = await api.get(
      `/services/apexrest/get_dashboard?cid=${cid}`,
    );
    return response.data;
  } catch (e) {
    console.log('Error: ' + e);
  }
};

export const getEventsData = async cid => {
  console.log('HITTING THE GET EVENTS APIS');
  try {
    const response = await api.get(
      `/services/apexrest/get_my_events?cid=${cid}`,
    );
    return response.data;
  } catch (e) {
    console.log('Error: ' + e);
  }
};

export const getProfileData = async cid => {
  console.log('HITTING THE GET PROFILE APIS');
  try {
    const response = await api.get(`/services/apexrest/get_profile?cid=${cid}`);
    return response.data;
  } catch (e) {
    console.log('Error: ' + e);
  }
};

export const addPreferredWorkLocation = async (cid, locations) => {
  console.log('HITTING THE Add Preferred Work Location  APIS');
  try {
    const response = await api.get(
      `/services/apexrest/add_preferred_work_location?cid=${cid}`,
      locations,
    );
    return response.data;
  } catch (e) {
    console.log('Error: ' + e);
  }
};

export const addWorkExperience = async (cid, experience) => {
  console.log('HITTING THE Add Work Experience  APIS');
  try {
    const response = await api.get(
      `/services/apexrest/add_work_experience?cid=${cid}`,
      experience,
    );
    return response.data;
  } catch (e) {
    console.log('Error: ' + e);
  }
};

export const referCandidate = async (cid, email) => {
  console.log('HITTING THE REFER CANDIDATE APIS');
  try {
    const response = await api.post(
      `/services/apexrest/refer_a_candidate?cid=${cid}`,
      {email:email},
    );
    return response.data;
  } catch (e) {
    console.log('Error: ' + e);
  }
};

export const getCandidateShifts = async cid => {
  console.log('HITTING THE GET CANDIDATE SHIFTS APIS');
  try {
    const response = await api.post(
      `/services/apexrest/get_temp_candidate_shifts?cid=${cid}`,
    );
    return response.data;
  } catch (e) {
    console.log('Error: ' + e);
  }
};

export const createShift = async (cid, shiftData) => {
  console.log('HITTING THE CREATE SHIFT APIS ', JSON.stringify(shiftData));
  try {
    const response = await api.post(
      `/services/apexrest/create_candidate_shift?cid=${cid}`,
      shiftData,
    );
    return response;
  } catch (e) {
    console.log('Error: ' + e);
  }
};
