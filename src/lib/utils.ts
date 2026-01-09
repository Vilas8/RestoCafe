export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const calculateCartTotal = (items: any[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const getSpicyLevel = (level: number): string => {
  const levels = ['Not Spicy', 'Mild', 'Medium', 'Hot'];
  return levels[level] || 'Unknown';
};
