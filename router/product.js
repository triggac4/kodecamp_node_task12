const router = require("express").Router();
const ProductController = require("../controller/product");

router
  .route("/")
  .get(ProductController.getAllProduct)
  .post(ProductController.createProduct);
router
  .route("/:id")
  .get(ProductController.getOneProduct)
  .put(ProductController.updateProduct)
  .delete(ProductController.deleteProduct);

module.exports = router;
