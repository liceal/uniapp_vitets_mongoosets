/// <reference types='@dcloudio/types' />
import "vue";

declare module "@vue/runtime-core" {
  type Hooks = App.AppInstance & Page.PageInstance;

  interface ComponentCustomOptions extends Hooks {}
}

declare module "vk-uview-ui";

import { UserDocument } from "@server/models/user";
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
