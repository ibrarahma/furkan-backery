export interface CustomerReview {
  id: string;
  customerName: string;
  locality: string;
  rating: number;
  cakeOrdered: string;
  reviewText: string;
  date: string;
  verifiedOrder: boolean;
}

export const SAMPLE_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-01',
    customerName: 'Ananya Reddy',
    locality: 'Jubilee Hills, Hyderabad',
    rating: 5,
    cakeOrdered: 'Classic Chocolate Truffle Cake',
    reviewText: 'Ordered for my husbands 30th birthday on short notice. The delivery was right on time at 7 PM, the cake was incredibly fresh, moist, and not overly sweet. Ordering via WhatsApp was seamless!',
    date: 'Yesterday',
    verifiedOrder: true
  },
  {
    id: 'rev-02',
    customerName: 'Karthik Varma',
    locality: 'Gachibowli, Hyderabad',
    rating: 5,
    cakeOrdered: 'Royal Red Velvet Cream Cheese Cake',
    reviewText: 'Hands down the best red velvet in Hyderabad. The cream cheese frosting is authentic and luxurious, not synthetic like most commercial bakeries. Our guests were raving about it!',
    date: '3 days ago',
    verifiedOrder: true
  },
  {
    id: 'rev-03',
    customerName: 'Sneha Rao',
    locality: 'Madhapur, Hyderabad',
    rating: 5,
    cakeOrdered: 'Garden Fresh Exotic Fruit Cake',
    reviewText: '100% eggless and so incredibly soft! The fruit glaze was vibrant with juicy strawberries and kiwi. The personalized message piped on top looked neat and elegant.',
    date: '1 week ago',
    verifiedOrder: true
  },
  {
    id: 'rev-04',
    customerName: 'Vikram & Pooja',
    locality: 'Banjara Hills, Hyderabad',
    rating: 5,
    cakeOrdered: 'Anniversary Sweetheart Heart Cake',
    reviewText: 'Sweet Crumbs made our 5th wedding anniversary memorable. The heart shape and gold leaf details were stunning in person. Thank you for the courteous delivery driver too!',
    date: '2 weeks ago',
    verifiedOrder: true
  }
];
