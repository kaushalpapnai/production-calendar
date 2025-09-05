# 📅 Production Calendar

A modern production planning calendar built with **React, TypeScript, and Tailwind CSS**.  
Easily manage production orders across multiple areas with visual calendar views, smart conflict detection, and streamlined order tracking.

---

## 🚀 Features

### 🗓 Calendar Views
- Monthly & Weekly views
- Area-based color coding
- Real-time updates

### 📦 Order Management
- Auto-generated order IDs with area prefixes (`#1P`, `#2A`)
- Conflict detection for overlapping orders
- Status & progress tracking
- Independent workflows for different areas

### 🎨 UI & UX
- Clean Tailwind-powered design
- Responsive (desktop + mobile)
- Light/Dark mode support
- Keyboard accessible modals

### 📋 Sidebar Tools
- Order list with filtering & search
- Expandable order details
- Quick edit/delete actions
- Circular progress visualization

---

## 🛠 Tech Stack
- **React 18** + **TypeScript**
- **Tailwind CSS**
- **Zustand** (state management with persistence)
- **date-fns** (date utilities)
- **Lucide React** (icons)
- **Vite** (build tool)

---

## 📦 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation
```bash
git clone https://github.com/your-username/production-calendar.git
cd production-calendar
npm install
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

---

## 🎯 Usage

### Create an Order

1. Open the **Create Order Modal** (`+` button)
2. Choose area, assignee, and dates
3. System generates area-specific order number
4. Conflicts in the same area are auto-detected

### Navigate the Calendar

* Arrows → move between months/weeks
* **Today** button → jump back to current date
* Click an order → view/edit details in sidebar

---

## 🏗 Project Structure

```
src/
├── components/
│   ├── Calendar/         # Calendar grid & navigation
│   ├── Orderpanel/       # Sidebar order list
│   ├── Modals/           # Order creation modal
│   └── UI/               # Shared UI components
├── store/                # Zustand state
├── types/                # TypeScript types
├── utils/                # Date utilities  
```

---

## 🎨 Customization

* **Add New Areas** → update `areas` in `CreateOrderModal.tsx`
* **Change Colors** → edit `getAreaPrefixStyle` in `OrderTag.tsx`
* **Custom Statuses** → modify `statusColors` in `orderStore.ts`

---

## 📸 Preview

![Main Calendar](https://github.com/kaushalpapnai/production-calendar/blob/master/project.png?raw=true)
![Weekly View](https://github.com/kaushalpapnai/production-calendar/blob/master/porject2.png?raw=true)
![Order Creation](https://github.com/kaushalpapnai/production-calendar/blob/master/project3.png?raw=true)

---

## 🐛 Known Issues

* Backdrop blur not supported in older Safari versions
* Mobile touch scrolling needs optimization
* Weekly view performance improvements required

---

## 🚧 Roadmap

* [ ] Drag & Drop orders between dates
* [ ] Recurring orders
* [ ] Gantt View (timeline)
* [ ] Team management & permissions
* [ ] Export/Import (CSV/Excel)
* [ ] Real-time sync (multi-user)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork repo
2. Create a branch (`feature/your-feature`)
3. Commit & push
4. Open a Pull Request

---

**Built with ❤️ by kaushal papnai**