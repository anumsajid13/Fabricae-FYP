import { Image as FabricImage } from "fabric";

declare module "fabric" {
  export interface Image extends FabricImage {
    filters: any[];
    applyFilters(): void;
  }
}