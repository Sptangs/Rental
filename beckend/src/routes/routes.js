const express = require("express");
const router = express.Router();
const authJWT = require("../middleware/authMiddleware");
const UserController = require("../controller/userController");
const MemberController = require("../controller/memberController");
const UnitPsController = require("../controller/unit_psController");
const MejaController = require("../controller/mejaController");
const SewaController = require("../controller/sewaController");
const BookingController = require("../controller/bookingController")

router.get("/users", authJWT,UserController.index);
router.get("/users/:id", authJWT,UserController.showUser);
router.post("/users", authJWT,UserController.StoreUser);
router.put("/users/:id",authJWT, UserController.editUser);
router.delete("/users/:id", authJWT,UserController.destroyUser);
router.post("/login", UserController.Login);

router.get("/members", MemberController.index);
router.post("/members", MemberController.StoreMember);
router.put("/members/:id", MemberController.editMember);
router.delete("/members/:id", MemberController.destroyMember);
router.post("/logmember", MemberController.loginMember);
router.get("/members/:idmember",MemberController.showMember);


router.get("/unit", UnitPsController.index);
router.post("/unit", UnitPsController.storeUnitPs);
router.put("/unit/:idunit", UnitPsController.editUnitPs);
router.get("/unit/:idunit", UnitPsController.showUnit);
router.delete("/unit/:id", UnitPsController.destroyUnitPs);

router.get("/meja", MejaController.index);
router.get("/meja/:idtempat", MejaController.showMeja);
router.post("/meja", MejaController.storeMeja);
router.put("/meja/:idtempat", MejaController.editMeja);
router.delete("/meja/:id", MejaController.destroyMeja);

router.get("/sewa", SewaController.index);
router.get("/sewa/:idsewa", SewaController.showSewa);
router.post("/sewa", SewaController.StoreSewa);
router.put("/sewa/:idsewa", SewaController.EditSewa);
router.delete("/sewa/:id", SewaController.DestroySewa);

router.get("/booking", BookingController.index);
router.get("/booking/:idbooking", BookingController.showBooking);
router.post("/booking", BookingController.storeBooking);
router.put("/booking/:idbooking", BookingController.EditBooking);
router.delete("/booking/:id", BookingController.DestroyBooking);

module.exports = router;