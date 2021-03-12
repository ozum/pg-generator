export default {
  // Values under "global" key is sent to all templates.
  global: {
    // We added an attribute called "addSchemaName". It has no special meaning, and you can choose any name.
    // We used "addSchemaName" in templates to determine whether to add schema names to class names.
    addSchemaName: true,
  },
  // Values under "tables" key is sent to templates related to corresponding table.
  tables: {
    // Data below only sent to templates related to `public.xyz` table.*/
    "public.xyz": {},
  },
};
