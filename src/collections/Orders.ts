import { CollectionConfig } from "payload/types";

export const Orders: CollectionConfig = {
  slug: "orders",
  fields: [
    {
      name: "total",
      type: "number",
      required: true,
    },
    {
      name: "selectValue",
      type: "select",
      hasMany: true,
      options: ["a", "b", "c"],
    },
  ],
  versions: { drafts: true },
};
