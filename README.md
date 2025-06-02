# ⚡ Vue.js Admin Dashboard

![image](https://github.com/user-attachments/assets/768970f4-3ad8-4c5b-a150-e4a68b86f07a)

A modern admin dashboard built with Vue 3, Vuetify 3, and Vue Router. Featuring role-based authentication, multi-language support, and responsive design.

## 👥 User Roles
-🛡️Admin 
-👑Super Admin
### Super Admin
- 📧 Email: `superadmin@example.com`  
- 🔒 Password: `password@123`

### Admin  
- Sign up and then use the Super Admin account to approve your admin access

## 📌 Features
- 🛡️ **Role-based access control** (Super Admin, Admin)
- 🌐 **Multi-language support** (i18n)
- 📱 **Fully responsive** design
- 🎨 **Dark and light** mode toggle
- 🧩 **Custom color palette** selection
- 🔐 **JWT authentication**
- 📊 **Dashboard analytics**
- 🛒 **Product management**
- 👥 **Customer management**
- 📦 **Order processing**
- ⚙️ **Store configuration**
- 🔄 **Real-time updates**


## 🧰 Tech Stack

- **Frontend**: Vue 3, Vuetify 3, Vue Router, Pinia
- **Build**: Vite
- **Internationalization**: vue-i18n
- **HTTP Client**: Axios
- **Notifications**: vue-toastification
- **Backend**: Express , MongoDB Atlas ,Cloudinary

  
## 🗂️ Project Structure

<details>
<summary>Click to view</summary>
src/
├── assets/          # Static assets
├── components/
│   ├── Shared/      # Common reusable components
│   ├── Settings/    # UI and user settings
│   ├── customers/   # Customer-related components
├── layouts/         # Layouts for public and private views
├── locales/         # Language translation files
├── router/          # App routing setup
├── store/           # Pinia store modules
├── styles/          # Global styles
├── utils/           # Helper functions
├── views/           # Main view components
└── App.vue          # App root component
</details>



## 🛠️ Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/vue-dashboard.git
   cd vue-dashboard
   cd client-side
   npm install.
   ```
 2.Environment Setup
   Create a .env file in the root directory:
   env
   VITE_API_BASE_URL=http://your-api-url.com

3.Run the development server
   ```sh
      npm run dev
   ```

4.Build for production
   ```sh
      npm run build
   ```


## 🤝 Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you want to change.

Before contributing:

- Follow existing component structure
- Write clear commit messages
- Test your changes locally

## 📬 Contact

For questions or suggestions:

- GitHub Issues tab
- Email: mariemhawary843@gmail.com

---

**Built by [Mariem , Menna , Radwa , Asmaaa , Rhama ]**

## 📄 License

This project is licensed under the MIT License.
You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the software.

