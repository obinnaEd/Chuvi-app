// api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Fixed USER_BASE_PATH to 'api/users/me'
const USER_BASE_PATH = 'api/users/me';


/**
 * Fetches the correct authentication token based on the endpoint being accessed.
 * @param {string} endpoint - The API endpoint being called.
 * @returns {string} The stored JWT token or an empty string.
 */
function getAuthToken(endpoint) {
    if (endpoint.startsWith('api/admin')) {
        return localStorage.getItem('adminToken');
    }
    // Default to user token for all other routes
    return localStorage.getItem('userToken');
}


async function authorizedFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const token = getAuthToken(endpoint);

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    if (!response.ok) {
        // Attempt to parse error body for message
        const errorBody = await response.json().catch(() => ({ message: 'Server error' }));
        throw new Error(errorBody.message || `HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        // Return JSON response if content type indicates it
        return response.json();
    }
    // Return null or empty object for successful responses without content (e.g., 204 No Content)
    return null;
}

// ====================================================================
// USER AUTH & PROFILE ENDPOINTS
// ====================================================================

// 1. User Registration
export async function register(userData) {
    return authorizedFetch('api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

// 2. User Login
export async function login(credentials) {
    return authorizedFetch('api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });
}


// 5. Verify Phone Number
export async function verifyPhone(verificationData) {
    return authorizedFetch('api/auth/verify-phone', {
        method: 'POST',
        body: JSON.stringify(verificationData)
    });
}

// 6. Resend Verification Code
export async function resendCode(phoneData) {
    return authorizedFetch('api/auth/resend-code', {
        method: 'POST',
        body: JSON.stringify(phoneData)
    });
}

// 7. Reset Password
export async function resetPassword(resetData) {
    return authorizedFetch('api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(resetData)
    });
}

// ====================================================================
// USER PROFILE / ADDRESSES / PREFERENCES / MEMBERSHIP
// ====================================================================

// PROFILE

/**
 * Fetches the currently authenticated user's profile data.
 */
export async function fetchUserProfile() {
    return authorizedFetch(`${USER_BASE_PATH}`, { method: 'GET' });
}

/**
 * Updates the user's profile details (fullName, email, phone).
 * Corresponds to: PUT /api/users/me
 * @param {object} updateData - { fullName, email, phone }
 */
export async function updateProfile(updateData) {
    return authorizedFetch(`${USER_BASE_PATH}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
    });
}

/**
 * Updates the user's password.
 * Corresponds to: PUT /api/users/me/password
 * @param {object} passwordData - { currentPassword, newPassword }
 */
export async function updatePassword(passwordData) {
    return authorizedFetch(`${USER_BASE_PATH}/password`, {
        method: 'PUT',
        body: JSON.stringify(passwordData)
    });
}


// ADDRESSES
export async function fetchAddresses() {
    return authorizedFetch(`${USER_BASE_PATH}/addresses`, { method: 'GET' });
}

export async function saveAddress(addressData) {
    return authorizedFetch(`${USER_BASE_PATH}/addresses`, {
        method: 'POST',
        body: JSON.stringify(addressData)
    });
}

export async function updateAddress(addressId, addressData) {
    return authorizedFetch(`${USER_BASE_PATH}/addresses/${addressId}`, {
        method: 'PUT',
        body: JSON.stringify(addressData)
    });
}

export async function deleteAddress(addressId) {
    return authorizedFetch(`${USER_BASE_PATH}/addresses/${addressId}`, {
        method: 'DELETE'
    });
}

// PREFERENCES
export async function updatePreferences(preferencesData) {
    return authorizedFetch(`${USER_BASE_PATH}/preferences`, {
        method: 'PATCH',
        body: JSON.stringify(preferencesData)
    });
}

// MEMBERSHIP

/**
 * Initiates or renews a user's membership.
 * Corresponds to: PUT api/users/membership/join
 */
export async function joinMembership(subscriptionDetails) {
    return authorizedFetch(`api/users/membership/join`, {
        method: 'PUT',
        body: JSON.stringify(subscriptionDetails)
    });
}

/**
 * Cancels or terminates a user's membership.
 * Corresponds to: POST api/users/membership/leave
 */
export async function leaveMembership() {
    return authorizedFetch(`api/users/membership/leave`, {
        method: 'POST'
    });
}

export async function createOrder(orderData) {
  return authorizedFetch('api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
}

/**
 * Get all orders by user phone
 * GET /api/orders/:phone
 */
export async function getUserOrders(phone) {
  return authorizedFetch(`api/orders/${phone}`, {
    method: 'GET'
  });
}

// ====================================================================
// ADMIN ENDPOINTS (Included for completeness)
// ====================================================================

export async function adminLogin(credentials) {
    return authorizedFetch('api/admin/login', { method: 'POST', body: JSON.stringify(credentials) });
}

export async function adminRegister(userData) {
    return authorizedFetch('api/admin/register', { method: 'POST', body: JSON.stringify(userData) });
}

export async function createEmployee(employeeData) {
    return authorizedFetch('api/admin/employees', { method: 'POST', body: JSON.stringify(employeeData) });
}

export async function getEmployees() {
    return authorizedFetch('api/admin/get-employees');
}

export async function deleteEmployee(id) {
    return authorizedFetch(`api/admin/employees/${id}`, { method: 'DELETE' });
}

export async function updateOrderStatus(orderId, newStatusData) {
    return authorizedFetch(`api/admin/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify(newStatusData) });
}

export async function createCoupon(couponData) {
    const mappedData = {
        code: couponData.couponCode,
        discountPercent: couponData.discountPercent,
        discountAmount: couponData.discountAmount,
        expiresAt: couponData.expiryDate,
        minOrderValue: couponData.minOrderValue,
        maxUses: couponData.maxUsage,
    };
    return authorizedFetch('api/admin/create/coupons', { method: 'POST', body: JSON.stringify(mappedData) });
}

export async function getAllCoupons() {
    return authorizedFetch('api/admin/coupons');
}

export async function updateCoupon(couponId, couponData) {
    const mappedData = {
        code: couponData.couponCode,
        discountPercent: couponData.discountPercent,
        discountAmount: couponData.discountAmount,
        expiresAt: couponData.expiryDate,
        minOrderValue: couponData.minOrderValue,
        maxUses: couponData.maxUsage,
    };
    return authorizedFetch(`api/admin/coupons/${couponId}`, { method: 'PUT', body: JSON.stringify(mappedData) });
}

export async function toggleCoupon(couponId) {
    return authorizedFetch(`api/admin/coupons/${couponId}/toggle`, { method: 'PATCH' });
}

export async function deleteCoupon(couponId) {
    return authorizedFetch(`api/admin/coupons/${couponId}`, { method: 'DELETE' });
}

export async function updateCouponStatus(couponId, statusData) {
    return authorizedFetch(`api/admin/coupons/${couponId}/status`, { method: 'PUT', body: JSON.stringify(statusData) });
}

export async function createSubscriptionPlan(planData) {
    return authorizedFetch('api/admin/create/subcription-plan', { method: 'POST', body: JSON.stringify(planData) });
}

export async function getAllSubscriptionPlans() {
    return authorizedFetch('api/admin/create/get-subcription-plan');
}

export async function getConfig() {
    return authorizedFetch('api/admin/get-config');
}

export async function getConfigByKey(key) {
    return authorizedFetch(`api/admin/config/${key}`);
}

export async function createConfig(configData) {
    return authorizedFetch('api/admin/create/config', { method: 'POST', body: JSON.stringify(configData) });
}

export async function deleteConfig(key) {
    return authorizedFetch(`api/admin/config/${key}`, { method: 'DELETE' });
}

export async function getServices() {
    return authorizedFetch('api/admin/get-services');
}

export async function createService(serviceData) {
    return authorizedFetch('api/admin/create/services', { method: 'POST', body: JSON.stringify(serviceData) });
}

export async function getServiceById(serviceId) {
    return authorizedFetch(`api/admin/services/${serviceId}`);
}

export async function updateService(serviceId, serviceData) {
    return authorizedFetch(`api/admin/services/${serviceId}`, { method: 'PUT', body: JSON.stringify(serviceData) });
}

export async function deleteService(serviceId) {
    return authorizedFetch(`api/admin/services/${serviceId}`, { method: 'DELETE' });
}

export async function getServicePricings() {
    return authorizedFetch('api/admin/get-service-pricings');
}

export async function getServicePricingById(pricingId) {
    return authorizedFetch(`api/admin/service-pricings/${pricingId}`);
}

export async function updateServicePricing(pricingId, pricingData) {
    return authorizedFetch(`api/admin/service-pricings/${pricingId}`, { method: 'PUT', body: JSON.stringify(pricingData) });
}

export async function deleteServicePricing(pricingId) {
    return authorizedFetch(`api/admin/service-pricings/${pricingId}`, { method: 'DELETE' });
}
