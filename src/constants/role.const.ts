export const ROLES = {
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  MEMBER: "MEMBER",
  CUSTOMER: "CUSTOMER",
  MESSENGER: "MESSENGER",
  ANONYMOUS: "ANONYMOUS",
  STAFF: "STAFF",
  ADMIN_EDITOR: ["ADMIN", "EDITOR"],
  ADMIN_EDITOR_MEMBER: ["ADMIN", "EDITOR", "MEMBER"],
  ADMIN_EDITOR_MEMBER_STAFF: ["ADMIN", "EDITOR", "MEMBER", "STAFF"],
  ADMIN_EDITOR_MEMBER_STAFF_CUSTOMER: ["ADMIN", "EDITOR", "MEMBER", "STAFF", "CUSTOMER"],
  ADMIN_EDITOR_CUSTOMER: ["ADMIN", "EDITOR", "CUSTOMER"],
  ADMIN_EDITOR_MEMBER_CUSTOMER: ["ADMIN", "EDITOR", "MEMBER", "CUSTOMER", "MESSENGER"],
  CUSTOMER_MESSENGER: ["CUSTOMER", "MESSENGER"],
  ANONYMOUS_CUSTOMER_MEMBER: ["ANONYMOUS", "CUSTOMER", "MEMBER"],
  ANONYMOUS_CUSTOMER_MEMBER_STAFF: ["ANONYMOUS", "CUSTOMER", "MEMBER", "STAFF"],
  ANONYMOUS_CUSTOMER_MEMBER_EDITOR_ADMIN: ["ANONYMOUS", "CUSTOMER", "MEMBER", "EDITOR", "ADMIN"],
};
