# Windows 95 Style Offline Page Template

A nostalgic Windows 95-style offline page template built with React, TypeScript, and [React95](https://github.com/arturbien/React95). Perfect for showing your website's offline state with a retro twist!

## 🌟 Features

- Authentic Windows 95 look and feel
- Fully interactive desktop environment
- Draggable windows and icons
- Working Start menu
- System clock
- Blue Screen of Death (BSOD) with restart sequence
- Responsive design
- TypeScript support
- Customizable content

## 🚀 Demo

Visit the [live demo](https://cloneit.pro) to see it in action!

## 🛠️ Built With

- React 19
- TypeScript
- React95 (Windows 95 UI components)
- Styled Components
- Vite

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cloneitpro/windows95-offline-template.git
   ```

2. Install dependencies:
   ```bash
   cd windows95-offline-template
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🎨 Customization

### Changing the Content

1. Modify the desktop icons in `src/App.tsx`:
   ```typescript
   const [icons, setIcons] = useState<DesktopIcon[]>([
     { id: '1', name: 'My Documents', icon: '📁', position: { x: 20, y: 20 } },
     // Add your icons here
   ]);
   ```

2. Update the window content:
   ```typescript
   const [windows, setWindows] = useState<WindowState[]>([
     {
       id: '1',
       title: 'My Window',
       content: <YourComponent />,
       position: { x: 100, y: 50 },
       isOpen: false
     },
     // Add your windows here
   ]);
   ```

### Styling

- Modify the desktop background in `DesktopWrapper` styled component
- Update the wallpaper text in the JSX
- Customize colors and dimensions in the CSS files

## 📱 Responsive Design

The template is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React95](https://github.com/arturbien/React95) for the amazing Windows 95 components
- Microsoft for the original Windows 95 design inspiration
- All contributors and users of this template

Made with 💾 and nostalgia
