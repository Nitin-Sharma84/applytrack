import { PAGE } from '../../constants/options.js'
import {
  IconAnalytics,
  IconBoard,
  IconDashboard,
  IconList,
  IconSettings,
} from '../ui/Icons.jsx'

/** One list feeds both the desktop Sidebar and the MobileNav, so they can never drift apart. */
export const NAV_ITEMS = Object.freeze([
  { page: PAGE.DASHBOARD, label: 'Dashboard', Icon: IconDashboard },
  { page: PAGE.APPLICATIONS, label: 'Applications', Icon: IconList },
  { page: PAGE.BOARD, label: 'Board', Icon: IconBoard },
  { page: PAGE.ANALYTICS, label: 'Analytics', Icon: IconAnalytics },
  { page: PAGE.SETTINGS, label: 'Settings', Icon: IconSettings },
])