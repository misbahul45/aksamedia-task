import {
  Inbox as InboxIcon,
  LayoutDashboard as BoardIcon,
  Calendar as PlannerIcon
} from 'lucide-vue-next'

export const sidebarMenu = [
  { path: '/app/inbox',   icon: InboxIcon,   text: 'Inbox'   },
  { path: '/app/board',   icon: BoardIcon,   text: 'Board'   },
  { path: '/app/planner', icon: PlannerIcon, text: 'Planner' }
]
