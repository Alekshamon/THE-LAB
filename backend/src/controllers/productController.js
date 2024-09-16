/* eslint-disable consistent-return */
const fs = require("fs");
const tables = require("../tables");

const browse = async (req, res, next) => {
  try {
    const products = await tables.product.getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const read = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await tables.product.getProductById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.json(product);
    }
  } catch (error) {
    next(error);
  }
};

const edit = async (req, res) => {
  try {
    const userId = req.payload;

    const { name, color } = req.body;
    const [admin] = await tables.user.getUserById(userId);
    if (admin[0].is_admin !== "admin" && admin[0].is_admin !== "superAdmin") {
      res.status(401).json({ error: "Vous n'avez pas les droits" });
    } else {
      const { id } = req.params;
      const [oldProductInfo] = await tables.product.getProductById(id);
      let { img } = oldProductInfo[0];
      if (req.file) {
        img = req.file.path;
      }

      const oldImgPath = oldProductInfo[0].img;
      const updateFields = {
        name,
        img,
        color,
      };
      // Créer un nouvel objet qui ne contient que les champs qui ne sont pas undefined
      const definedFields = Object.entries(updateFields).reduce(
        (a, [k, v]) => (v === undefined ? a : { ...a, [k]: v }),
        {}
      );

      const [result] = await tables.product.updateSpecificProductById(
        id,
        definedFields
      );
      if (result.affectedRows) {
        if (req.file) {
          fs.unlinkSync(oldImgPath);
        }
        res.status(201).json({ message: "Product update !" });
      } else {
        fs.unlinkSync(req.file.path);
        res.status(401).send("erreur lors de l'enregistrement");
      }
    }
    // Récupérer l'ancienne photo de l'utilisateur
  } catch (error) {
    fs.unlinkSync(req.file.path);
    res.status(500).send(error);
  }
};

const add = async (req, res) => {
  try {
    const id = req.payload;
    const [admin] = await tables.user.getUserById(id);

    if (admin[0].is_admin !== "admin" && admin[0].is_admin !== "superAdmin") {
      fs.unlinkSync(req.file.path);
      return res.status(401).json({ error: "Vous n'avez pas les droits" });
    }
    const { name, color } = req.body;
    if (!name || !color) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Missing fields" });
    }
    const img = req.file.path;
    const [result] = await tables.product.addProduct(name, img, color);
    if (result.affectedRows) {
      res.json({ message: "Product added !" });
    } else {
      fs.unlinkSync(req.file.path);
      res.json({ message: "Error !" });
    }
  } catch (error) {
    fs.unlinkSync(req.file.path);
    res.status(500).json({ message: error });
  }
};

const remove = async (req, res) => {
  try {
    const productId = req.params.id;
    const [product] = await tables.product.getProductById(productId);
    if (product[0].length === 0) {
      res.status(404).json({ message: "Product not found" });
    }
    const [deleteProduct] = await tables.product.deleteProductById(productId);

    // Supprimer le fichier image associé s'il existe
    if (deleteProduct.affectedRows) {
      fs.unlinkSync(product[0].img);
      res.json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  browse,
  read,
  edit,
  add,
  remove,
};
