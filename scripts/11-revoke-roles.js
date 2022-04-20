import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0x988460dE836fBa285B23d60b515a557135078d48");

(async () => {
  try {
    // log current roles
    const allRoles = await token.roles.getAll();
    console.log("👀 Roles that exist right now:", allRoles);

    // clear admin and minter roles
    await token.roles.setAll({ admin: [], minter: [] });
    console.log(
      "🎉 Roles after revoking ourselves",
      await token.roles.getAll()
    );
    console.log(
      "Successfully removed admin and minter roles from token contract!"
    );
  } catch (error) {
    console.error("Failed to remove roles from token contract".error);
  }
})();
