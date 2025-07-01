/// <reference types='@dcloudio/types' />
import "vue";

declare module "@vue/runtime-core" {
  type Hooks = App.AppInstance & Page.PageInstance;

  interface ComponentCustomOptions extends Hooks {}
}

declare module "vk-uview-ui";

import { UserDocument } from "#/models/user";
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

// map
interface MapMarker {
  id: number;
  longitude: number;
  latitude: number;
  iconPath: string;
  width: number;
  height: number;
}

interface MapPolyline {
  points: Array<{ longitude: number; latitude: number }>;
  color: string;
  width: number;
}

interface MapTypes {
  longitude?: number;
  latitude?: number;
  scale?: number;
  markers?: MapMarker[];
  polyline?: MapPolyline[];
}
