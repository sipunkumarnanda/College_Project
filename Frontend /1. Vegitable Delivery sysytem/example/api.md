+-----+--------+-----------------------------------------+--------------------------------------+--------+
| No. | Method | Endpoint                                | Description                          | Access |
+-----+--------+-----------------------------------------+--------------------------------------+--------+
| 1   | POST   | /api/auth/register                      | Register new user                    | Public |
| 2   | POST   | /api/auth/login                         | User login                           | Public |
| 3   | GET    | /api/auth/me                            | Get current user details             | User   |
| 4   | GET    | /api/products                           | Get all products                     | Public |
| 5   | GET    | /api/products/:id                       | Get single product                   | Public |
| 6   | POST   | /api/products                           | Add new product                      | Vendor |
| 7   | PUT    | /api/products/:id                       | Update product                       | Vendor |
| 8   | DELETE | /api/products/:id                       | Delete product                       | Vendor |
| 9   | GET    | /api/cart                               | Get user cart                        | User   |
| 10  | POST   | /api/cart                               | Add to cart                          | User   |
| 11  | PUT    | /api/cart/:id                           | Update cart item                     | User   |
| 12  | DELETE | /api/cart/:id                           | Remove cart item                     | User   |
| 13  | POST   | /api/orders                             | Place order                          | User   |
| 14  | GET    | /api/orders/my                          | Get user orders                      | User   |
| 15  | GET    | /api/vendor/orders                      | Get vendor orders                    | Vendor |
| 16  | PUT    | /api/orders/:id/status                  | Update order status                  | Vendor |
| 17  | GET    | /api/vendor/orders/:id/invoice          | Download invoice                     | Vendor |
| 18  | POST   | /api/reviews                            | Add review                           | User   |
| 19  | GET    | /api/reviews/:productId                 | Get product reviews                  | Public |
| 20  | GET    | /api/vendor/stats                       | Vendor dashboard stats               | Vendor |
| 21  | GET    | /api/admin/vendors                      | Get all vendors                      | Admin  |
| 22  | PUT    | /api/admin/vendors/:id/toggle           | Activate/Deactivate vendor           | Admin  |
| 23  | GET    | /api/support                            | Get complaints                       | Admin  |
| 24  | POST   | /api/support                            | Raise complaint                      | User   |
| 25  | POST   | /api/payment/create                     | Create payment order                 | User   |
| 26  | POST   | /api/payment/verify                     | Verify payment                       | User   |
| 27  | GET    | /api/payout                             | Get vendor payouts                   | Vendor |
+-----+--------+-----------------------------------------+--------------------------------------+--------+