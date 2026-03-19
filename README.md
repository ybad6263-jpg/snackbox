# Snack Box Builder

A modern, mobile-responsive web app for building your perfect snack box with drag-and-drop ease.

## Features

✨ **Modern UI**
- Light, clean, minimalist design with soft cream background (#F9F8F6)
- Vibrant orange (#FF6B00) primary buttons with rounded extra-large corners
- Smooth Framer Motion animations with "pop" effects when adding snacks

📦 **Core Functionality**
- 12-slot cardboard box grid showing visual representation
- Sticky header with real-time progress bar (Slots Filled: X/12)
- Drag-and-drop snack placement from menu into box
- Three snack categories: Sweet, Savory, and Drinks
- Each snack has size constraints (1, 2, or 4 slots)
- Prevents adding snacks when box is full

⚡ **Quick Add Features**
- Pre-set themes: Exam Night, Movie Marathon, Road Trip, Party Pack
- One-click theme application for instant snack suggestions
- Live price calculation and total display

🎨 **Responsive Design**
- Desktop: Sidebar snack menu with sticky positioning
- Mobile: Bottom drawer snack menu with smooth animations
- Floating Action Button showing live total price (desktop)
- Mobile-friendly review button and interface

## Getting Started

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

### Running the App

```bash
# Start development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

### Components
- **Header**: Sticky top bar with progress indicator
- **BoxGrid**: 12-slot visual grid showing added snacks
- **SnackMenu**: Categorized snack list with drag-drop support
- **ReviewBox**: Modal showing cart summary and total price
- **QuickAddThemes**: Pre-set snack combinations
- **FloatingActionButton**: Quick access review button

### Hooks
- **useSnackBox**: Custom hook managing box state, snack validation, and pricing

### Data Structure
- **SNACKS**: Catalog of 18 snacks across 3 categories
- **QUICK_ADD_THEMES**: 4 pre-set theme combinations
- **MAX_SLOTS**: Box capacity constant (12)

## Design System

### Colors
- **Background**: Cream (#F9F8F6)
- **Primary**: Orange (#FF6B00)
- **Secondary Accent**: Lighter Orange (#FF8C2F)
- **Text**: Dark Gray (#2C2C2C)
- **Borders**: Light Gray (#E8E7E3)

### Typography
- Font: Geist (system default)
- Semantic sizing for all text elements
- Responsive font scaling for mobile

### Spacing & Radius
- Base border radius: 2rem (rounded-3xl)
- Consistent padding scale using Tailwind utilities
- Gap utilities for flexible layouts

## Technologies Used

- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations & interactions
- **Lucide React** - Icons
- **TypeScript** - Type safety

## Interactions

### Adding Snacks
1. **Click**: Click any snack button in the menu
2. **Drag & Drop**: Drag snacks from menu into the box
3. **Disabled State**: Snacks are disabled if box doesn't have enough space

### Removing Snacks
- Hover over snack in box to reveal remove button (X)
- Click remove button or use Review Box modal

### Quick Add
- Click any theme card to add all snacks at once
- Respects box capacity constraints

### Review & Checkout
- Click Floating Action Button (desktop) or mobile review button
- View summary, see total price, remove individual items
- Clear entire box if needed

## Future Enhancements

- Save favorite boxes
- Share box combinations via URL
- User accounts with saved histories
- Real checkout integration
- Custom snack creation
- Dark mode toggle
