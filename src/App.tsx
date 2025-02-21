import React, { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableHeadCell,
  TableDataCell,
  Toolbar,
  Window,
  WindowHeader,
  WindowContent,
  Button,
  styleReset,
  List,
  ListItem,
  Divider
} from 'react95';
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';
import styled from 'styled-components';
import './App.css';

// ==================== Global Styles ====================
const GlobalStyles = createGlobalStyle`
  ${styleReset}

  body {
    font-family: 'ms_sans_serif', sans-serif;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal;
  }
`;

// ==================== Styled Components ====================

const DesktopWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #008080;
  overflow: hidden;

  .wallpaper-text {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    color: rgba(255, 255, 255, 0.3);
    font-size: 60px;
    font-weight: bold;
    user-select: none;

    .offline-text {
      font-size: 16px;
      margin-top: 8px;
      text-align: right;
    }

    @media (max-width: 480px) {
      font-size: 40px;
      .offline-text {
        font-size: 14px;
      }
    }
  }

  .desktop-icons {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .desktop-icon {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 64px;
    padding: 4px;
    cursor: pointer;
    user-select: none;

    .icon {
      font-size: 32px;
      margin-bottom: 4px;
    }

    .icon-name {
      text-align: center;
      font-size: 14px;
      color: #fff;
      text-shadow: 1px 1px 2px #000;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (max-width: 480px) {
      width: 48px;
      .icon {
        font-size: 24px;
      }
      .icon-name {
        font-size: 12px;
      }
    }
  }

  /* Wichtig: Taskbar fixieren und z-index hochsetzen */
  .taskbar {
    display: flex;
    align-items: center;
    position: fixed; /* statt absolute */
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background: #c0c0c0;
    border-top: 2px solid #fff;
    box-sizing: border-box;
    padding: 0 6px;
    z-index: 999; /* hoch, damit sie nicht überdeckt wird */

    @media (max-width: 480px) {
      height: 36px;
    }
  }

  .start-button {
    display: flex;
    align-items: center;
    height: 32px;
    margin-right: 4px;

    .windows-logo {
      margin-right: 8px;
    }

    @media (max-width: 480px) {
      height: 28px;
      font-size: 12px;
      .windows-logo {
        margin-right: 4px;
      }
    }
  }

  .taskbar-divider {
    width: 2px;
    height: 60%;
    background: #888;
    margin: 0 4px;
  }
`;

const StartMenuWrapper = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 320px;
  background-color: silver;
  border: 2px solid #000;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  cursor: default;

  @media (max-width: 480px) {
    width: 240px;
  }
`;

const BlueScreenOverlay = styled.div<{ isRestarting: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ isRestarting }) => (isRestarting ? '#000' : '#000088')};
  color: white;
  padding: 40px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  line-height: 1.4;
  z-index: 9999;
  overflow: auto;

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 20px;
  }
`;

// ==================== Interfaces & Mock Data ====================

interface DesktopIcon {
  id: string;
  name: string;
  icon: string;
  position: { x: number; y: number };
}

interface WindowState {
  id: string;
  title: string;
  content: React.ReactNode;
  position: { x: number; y: number };
  isOpen: boolean;
  isDragging?: boolean;
}

interface DeletedFile {
  name: string;
  type: string;
  size: string;
  deletedDate: string;
  originalLocation: string;
}

interface RecentFile {
  name: string;
  path: string;
  date: string;
}

const recentFiles: RecentFile[] = [
  { name: 'cloneit_backup.zip', path: 'C:\\Backups', date: 'Feb 15, 2024' },
  { name: 'important_login_credentials.txt', path: 'C:\\Documents', date: 'Feb 14, 2024' },
  { name: 'server_config.json', path: 'C:\\Projects', date: 'Feb 13, 2024' },
  { name: 'todo_list.md', path: 'C:\\Documents', date: 'Feb 12, 2024' },
];

const deletedFiles: DeletedFile[] = [
  {
    name: 'index.php',
    type: 'PHP File',
    size: '2.4 KB',
    deletedDate: 'Feb 15, 2024, 2:23 PM',
    originalLocation: 'C:\\Projects\\cloneit\\public'
  },
  {
    name: 'project_plan.txt',
    type: 'Text Document',
    size: '8.1 KB',
    deletedDate: 'Feb 15, 2024, 2:22 PM',
    originalLocation: 'C:\\Projects\\cloneit\\docs'
  },
  {
    name: 'database.sql',
    type: 'SQL File',
    size: '156 KB',
    deletedDate: 'Feb 15, 2024, 2:21 PM',
    originalLocation: 'C:\\Projects\\cloneit\\database'
  },
  {
    name: 'README.md',
    type: 'Markdown File',
    size: '4.2 KB',
    deletedDate: 'Feb 15, 2024, 2:21 PM',
    originalLocation: 'C:\\Projects\\cloneit'
  },
  {
    name: '.env',
    type: 'ENV File',
    size: '0.4 KB',
    deletedDate: 'Feb 15, 2024, 2:20 PM',
    originalLocation: 'C:\\Projects\\cloneit'
  }
];

const RecycleBinContent = () => (
  <div style={{ width: '100%', height: '100%' }}>
    <Table style={{ width: '100%' }}>
      <TableHead>
        <TableRow>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Type</TableHeadCell>
          <TableHeadCell>Size</TableHeadCell>
          <TableHeadCell>Deleted on</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {deletedFiles.map((file, index) => (
          <TableRow key={index}>
            <TableDataCell style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '4px' }}>📄</span>
              {file.name}
            </TableDataCell>
            <TableDataCell>{file.type}</TableDataCell>
            <TableDataCell>{file.size}</TableDataCell>
            <TableDataCell>{file.deletedDate}</TableDataCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

// Hilfs-Datensatz für das Startmenü (My Documents, My Computer, Recycle Bin etc.)
const startMenuItems = [
  {
    label: 'My Documents',
    icon: '📁',
    id: '1'
  },
  {
    label: 'My Computer',
    icon: '🖥️',
    id: '2'
  },
  {
    label: 'Recycle Bin',
    icon: '🗑️',
    id: '3'
  }
];

// ==================== Hauptkomponente App ====================
function App() {
  // Handler-Definitionen
  const handleShutdown = () => {
    setShowBluescreen(true);
    setIsStartMenuOpen(false);
  };

  const handleStartClick = () => {
    setIsStartMenuOpen((prev) => !prev);
  };

  // State
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: '1',
      title: 'My Documents',
      content: (
        <div style={{ padding: '10px' }}>
          <div style={{ marginBottom: '20px', color: '#666' }}>
            <span style={{ fontSize: '48px', display: 'block', textAlign: 'center' }}>🤔</span>
            <p style={{ textAlign: 'center', marginTop: '10px' }}>
              Hmmm... there used to be some files here...
            </p>
          </div>
          <div
            style={{
              backgroundColor: '#ffffe1',
              padding: '10px',
              border: '1px solid #000',
              fontFamily: 'Comic Sans MS, cursive',
              fontSize: '12px'
            }}
          >
            <p style={{ margin: '0 0 8px 0' }}>🗒️ NOTE TO SELF:</p>
            <p style={{ margin: '0 0 4px 0' }}>- Make a backup of cloneit.pro ✓</p>
            <p style={{ margin: '0 0 4px 0' }}>- Delete all files ✓</p>
            <p style={{ margin: '0 0 4px 0' }}>- Turn off the server ✓</p>
            <p style={{ margin: '0 0 4px 0' }}>- Return the shovel ✓</p>
            <p style={{ margin: '0 0 4px 0', textDecoration: 'line-through' }}>
              - Delete this note
            </p>
            <p style={{ margin: '0', marginTop: '8px', color: 'red', fontWeight: 'bold' }}>
              (The project is dead, folks!)
            </p>
          </div>
        </div>
      ),
      position: { x: 100, y: 50 },
      isOpen: false
    },
    {
      id: '3',
      title: 'Recycle Bin',
      content: <RecycleBinContent />,
      position: { x: 150, y: 50 },
      isOpen: false
    },
    {
      id: 'start',
      title: 'Start Menu',
      content: (
        <List>
          {startMenuItems.map((item) => (
            <ListItem key={item.id}>
              <span style={{ marginRight: '8px' }}>{item.icon}</span>
              {item.label}
            </ListItem>
          ))}
          <Divider />
          <div style={{ padding: '8px', color: '#444' }}>Recently used:</div>
          {recentFiles.map((file, index) => (
            <ListItem key={index} style={{ fontSize: '12px' }}>
              <span style={{ marginRight: '8px' }}>📄</span>
              {file.name}
              <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#666' }}>
                {file.date}
              </span>
            </ListItem>
          ))}
          <Divider />
          <ListItem onClick={handleShutdown}>
            <span style={{ marginRight: '8px' }}>🔴</span>
            Shut Down...
          </ListItem>
        </List>
      ),
      position: { x: 0, y: window.innerHeight - 340 },
      isOpen: false
    }
  ]);

  const [icons, setIcons] = useState<DesktopIcon[]>([
    { id: '1', name: 'My Documents', icon: '📁', position: { x: 20, y: 20 } },
    { id: '2', name: 'My Computer', icon: '🖥️', position: { x: 20, y: 100 } },
    { id: '3', name: 'Recycle Bin', icon: '🗑️', position: { x: 20, y: 180 } }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [draggingIcon, setDraggingIcon] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showError, setShowError] = useState(false);
  const [showBluescreen, setShowBluescreen] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootPhase, setBootPhase] = useState('');

  // ==================== useEffects ====================
  // Uhrzeit aktualisieren
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Bluescreen: Keypress, um ggf. Neustart zu triggern
  useEffect(() => {
    const handleKeyPress = () => {
      if (showBluescreen && !isRestarting) {
        handleRestart();
      }
    };

    if (showBluescreen) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [showBluescreen, isRestarting]);

  // Mouse-Event-Listener fürs Fenster-Dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (windows.some((win) => win.isDragging)) {
        handleWindowDrag(e);
      }
    };

    const handleMouseUp = () => {
      if (windows.some((win) => win.isDragging)) {
        handleWindowDragEnd();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [windows, dragOffset]);

  // ==================== Handler-Funktionen ====================

  // Fenster oder Error öffnen
  const handleIconDoubleClick = (iconId: string) => {
    // "My Computer" zeigt Fehlermeldung
    if (iconId === '2') {
      setShowError(true);
      return;
    }
    // Ansonsten Fenster öffnen
    const windowToOpen = windows.find((win) => win.id === iconId);
    if (windowToOpen) {
      setWindows((prev) =>
        prev.map((win) => (win.id === iconId ? { ...win, isOpen: true } : win))
      );
      setIsStartMenuOpen(false);
    }
  };

  // Fenster schließen
  const handleCloseWindow = (windowId: string) => {
    setWindows((prev) =>
      prev.map((win) => (win.id === windowId ? { ...win, isOpen: false } : win))
    );
    if (windowId === 'start') {
      setIsStartMenuOpen(false);
    }
  };

  // Neustart
  const handleRestart = () => {
    setIsRestarting(true);
    setBootProgress(0);
    setBootPhase('');

    // Boot-Sequenz simulieren
    setTimeout(() => setBootPhase('bios'), 1000);
    setTimeout(() => setBootPhase('memory'), 2000);
    setTimeout(() => setBootPhase('devices'), 4000);
    setTimeout(() => setBootPhase('boot'), 6000);

    const progressInterval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 60);

    // Komplett hochgefahren
    setTimeout(() => {
      clearInterval(progressInterval);
      setShowBluescreen(false);
      setIsRestarting(false);
      setBootProgress(0);
      setBootPhase('');
    }, 8000);
  };

  // Desktop-Icon Drag & Drop
  const handleDragStart = (iconId: string, e: React.DragEvent) => {
    setDraggingIcon(iconId);
    // Transparentes Drag-Image
    const dragIcon = new Image();
    dragIcon.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(dragIcon, 0, 0);
  };

  const handleDrag = (e: React.DragEvent) => {
    if (draggingIcon !== null && e.clientX !== 0 && e.clientY !== 0) {
      setIcons((prev) =>
        prev.map((icon) =>
          icon.id === draggingIcon
            ? { ...icon, position: { x: e.clientX - 32, y: e.clientY - 32 } }
            : icon
        )
      );
    }
  };

  const handleDragEnd = () => {
    setDraggingIcon(null);
  };

  // Window-Dragging (Mousedown, Mousemove, Mouseup)
  const handleWindowDragStart = (windowId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const targetWindow = windows.find((w) => w.id === windowId);
    if (targetWindow) {
      setDragOffset({
        x: e.clientX - targetWindow.position.x,
        y: e.clientY - targetWindow.position.y
      });
      setWindows((prev) =>
        prev.map((win) =>
          win.id === windowId ? { ...win, isDragging: true } : win
        )
      );
    }
  };

  const handleWindowDrag = (e: MouseEvent) => {
    setWindows((prev) =>
      prev.map((win) =>
        win.isDragging
          ? {
              ...win,
              position: {
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
              }
            }
          : win
      )
    );
  };

  const handleWindowDragEnd = () => {
    setWindows((prev) =>
      prev.map((win) => (win.isDragging ? { ...win, isDragging: false } : win))
    );
  };

  // ==================== Render ====================
  return (
    <>
      <GlobalStyles />
      <DesktopWrapper className="desktop">
        <div className="wallpaper-text">
          cloneit.pro
          <div className="offline-text">OFFLINE</div>
        </div>

        {/* Desktop Icons */}
        <div className="desktop-icons">
          {icons.map((icon) => (
            <div
              key={icon.id}
              className="desktop-icon"
              draggable
              onDragStart={(e) => handleDragStart(icon.id, e)}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              style={{
                left: icon.position.x,
                top: icon.position.y
              }}
              onDoubleClick={() => handleIconDoubleClick(icon.id)}
            >
              <span className="icon">{icon.icon}</span>
              <span className="icon-name">{icon.name}</span>
            </div>
          ))}
        </div>

        {/* Error Window (falls "My Computer" geöffnet wird) */}
        {showError && (
          <Window
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 999,
              width: '400px'
            }}
          >
            <WindowHeader>
              <span>SYSTEM ERROR</span>
              <Button
                onClick={() => setShowError(false)}
                style={{ marginLeft: 'auto' }}
              >
                <span style={{ fontFamily: 'sans-serif' }}>×</span>
              </Button>
            </WindowHeader>
            <WindowContent>
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '48px', display: 'block' }}>⚠️</span>
                  FATAL ERROR 404
                </p>
                <p>The requested website was not found.</p>
                <p>The server was presumably battered with a shovel.</p>
                <p style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
                  Error code: CLONEIT_OFFLINE_ERR
                </p>
                <div style={{ marginTop: '20px' }}>
                  <Button onClick={() => setShowError(false)}>OK</Button>
                </div>
              </div>
            </WindowContent>
          </Window>
        )}

        {/* Windows (My Documents, Recycle Bin, etc.) */}
        {windows.map((win) =>
          win.isOpen && (
            <Window
              key={win.id}
              style={{
                zIndex: win.isDragging ? 100 : 1,
                position: 'absolute',
                left: win.position.x,
                top: win.position.y,
                width: win.id === '3' ? '600px' : '300px'
              }}
            >
              <WindowHeader
                className="window-header"
                onMouseDown={(e) => handleWindowDragStart(win.id, e)}
                style={{ cursor: 'move', userSelect: 'none' }}
              >
                <span>{win.title}</span>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseWindow(win.id);
                  }}
                  style={{ marginLeft: 'auto' }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <span style={{ fontFamily: 'sans-serif' }}>×</span>
                </Button>
              </WindowHeader>
              <Toolbar>
                <Button variant="menu" style={{ marginRight: '2px' }}>
                  File
                </Button>
                <Button variant="menu" style={{ marginRight: '2px' }}>
                  Edit
                </Button>
                <Button variant="menu" style={{ marginRight: '2px' }}>
                  View
                </Button>
                {win.id === '3' && (
                  <>
                    <Button variant="menu" style={{ marginRight: '2px' }}>
                      Restore
                    </Button>
                    <Button variant="menu" style={{ marginRight: '2px' }}>
                      Delete permanently
                    </Button>
                  </>
                )}
              </Toolbar>
              <WindowContent>{win.content}</WindowContent>
            </Window>
          )
        )}

        {/* Taskbar (jetzt fixiert) */}
        <div className="taskbar">
          <Button
            variant="raised"
            className="start-button"
            data-active={isStartMenuOpen}
            onClick={handleStartClick}
          >
            <span className="windows-logo">🪟</span>
            Start
          </Button>
          <div className="taskbar-divider" />
          {windows
            .filter((win) => win.isOpen)
            .map((win) => (
              <Button
                key={win.id}
                variant="flat"
                className="taskbar-item"
                style={{
                  width: '100%',
                  maxWidth: '200px',
                  marginLeft: '4px'
                }}
              >
                {win.title}
              </Button>
            ))}
          <div style={{ marginLeft: 'auto', padding: '0 8px' }}>
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Start Menu (Overlay) */}
        {isStartMenuOpen && (
          <StartMenuWrapper id="start-menu">
            <List>
              {startMenuItems.map((item) => (
                <ListItem
                  key={item.id}
                  onClick={() => {
                    handleIconDoubleClick(item.id);
                    setIsStartMenuOpen(false);
                  }}
                >
                  <span style={{ marginRight: '8px' }}>{item.icon}</span>
                  {item.label}
                </ListItem>
              ))}
              <Divider />
              <div style={{ padding: '8px', color: '#444' }}>Recently used:</div>
              {recentFiles.map((file, index) => (
                <ListItem key={index} style={{ fontSize: '12px' }}>
                  <span style={{ marginRight: '8px' }}>📄</span>
                  {file.name}
                  <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#666' }}>
                    {file.date}
                  </span>
                </ListItem>
              ))}
              <Divider />
              <ListItem onClick={handleShutdown}>
                <span style={{ marginRight: '8px' }}>🔴</span>
                Shut Down...
              </ListItem>
            </List>
          </StartMenuWrapper>
        )}

        {/* Bluescreen / Boot-Screen Overlay */}
        {showBluescreen && (
          <BlueScreenOverlay
            isRestarting={isRestarting}
            onClick={() => {
              // Klick/Touch zum Neustart, falls kein Restart läuft
              if (!isRestarting) handleRestart();
            }}
          >
            <pre style={{ whiteSpace: 'pre-wrap', lineHeight: '1.2' }}>
              {isRestarting ? (
                bootPhase === 'bios' ? `
Phoenix BIOS 4.0 Release 6.0
Copyright (C) 1985-1999 Phoenix Technologies Ltd.
All Rights Reserved

CPU: Intel(R) 80486DX2-66 CPU
Memory Test: ${bootProgress}%
` : bootPhase === 'memory' ? `
640K Base Memory
15360K Extended Memory

Checking Memory... OK
Checking CMOS... OK
Checking DMA... OK
` : bootPhase === 'devices' ? `
Checking Primary Master... OK
Checking Primary Slave... Not Found
Checking Secondary Master... Not Found
Checking Secondary Slave... Not Found

Initializing Mouse... OK
Initializing Keyboard... OK
` : bootPhase === 'boot' ? `
Starting MS-DOS...

HIMEM is testing extended memory...done.

C:\\>_
` : `
System is restarting...
`
              ) : `
A problem has been detected and Windows has been shut down to prevent damage to your computer.

CLONEIT_OFFLINE_CRITICAL_ERROR

If this is the first time you've seen this error:
* The website has been successfully deleted
* All data is permanently destroyed
* The server is on a beach vacation somewhere far away

Technical Information:
*** STOP: 0x000000FE (0xC000009C, 0x00000004, 0x00000000, 0xFFFFFA80)

Collecting crash info... 100% Complete

Press any key (or tap) to restart this ancient machine
`}
            </pre>
          </BlueScreenOverlay>
        )}
      </DesktopWrapper>
    </>
  );
}

export default App;
