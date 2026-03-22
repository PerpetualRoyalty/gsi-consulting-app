/**
 * Format currency amount to USD string
 * @param {number} amount - Amount in cents
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  const dollars = amount / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dollars);
};

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Get Tailwind color classes based on status
 * @param {string} status - Status value
 * @returns {string} Tailwind color classes
 */
export const getStatusColor = (status) => {
  const statusMap = {
    draft: 'text-gray-600 bg-gray-100',
    pending: 'text-yellow-600 bg-yellow-100',
    active: 'text-green-600 bg-green-100',
    completed: 'text-green-600 bg-green-100',
    approved: 'text-green-600 bg-green-100',
    rejected: 'text-red-600 bg-red-100',
    cancelled: 'text-red-600 bg-red-100',
    on_hold: 'text-orange-600 bg-orange-100',
    in_progress: 'text-blue-600 bg-blue-100',
  };

  return statusMap[status] || 'text-gray-600 bg-gray-100';
};

/**
 * Get styled badge classes based on status
 * @param {string} status - Status value
 * @returns {string} Badge classes
 */
export const getStatusBadge = (status) => {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';
  return `${baseClasses} ${getStatusColor(status)}`;
};

/**
 * Generate formatted agreement number
 * @returns {string} Agreement ID in format AGR-YYYYMMDD-XXXXX
 */
export const generateAgreementNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();

  return `AGR-${year}${month}${day}-${random}`;
};

/**
 * Conditionally join classNames together
 * @param {...(string|object|null|undefined|boolean)} classes - Classes to join
 * @returns {string} Joined class string
 */
export const classNames = (...classes) => {
  return classes
    .filter(Boolean)
    .flat()
    .map((cls) => {
      if (typeof cls === 'object') {
        return Object.keys(cls)
          .filter((key) => cls[key])
          .join(' ');
      }
      return cls;
    })
    .join(' ')
    .trim();
};
