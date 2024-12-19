require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');


const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create a Mongoose Schema and Model for user registration
const registrationSchema = new mongoose.Schema({
  username: String,
  email: String,
  idNumber: String,
  phoneNumber: String,
  organization: String,
  role: String,
  departmentName: String,
});

const Registration = mongoose.model('Registration', registrationSchema);

// Route to check if email exists
app.post('/checkEmail', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email exists
    const existingUser = await Registration.findOne({ email });
    if (existingUser) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle user registration
app.post('/register', async (req, res) => {
  try {
    const { username, email, idNumber, phoneNumber, organization, role, departmentName } = req.body;

    // Check if email already exists
    const existingUser = await Registration.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newRegistration = new Registration({
      username,
      email,
      idNumber,
      phoneNumber,
      organization,
      role,
      departmentName,
    });

    const savedRegistration = await newRegistration.save();
    res.status(201).json(savedRegistration);
  } catch (error) {
    console.error('Error saving registration:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to get user role based on email
app.post('/getUserRole', async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email and get their role
    const user = await Registration.findOne({ email });
    if (user) {
      const { role } = user;
      res.json({ role });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).send('Internal Server Error');
  }
});


  app.post('/getUserInfo', async (req, res) => {
    try {
      const { email } = req.body;

      // Find user by email and get their name, role, and department
      const user = await Registration.findOne({ email });
      if (user) {
        const { username, role, organization,departmentName } = user;
        res.json({ username, role, organization, departmentName });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      res.status(500).send('Internal Server Error');
    }
  });



// Create a Mongoose Schema and Model for tasks
const taskSchema = new mongoose.Schema({
  taskName: String,
  email: String
});

const Task = mongoose.model('Task', taskSchema);

// Route to get tasks

// Route to get tasks for a specific email
app.get('/getTasks', async (req, res) => {
  try {
      const { email } = req.query;
      if (!email) {
          throw new Error('Email is required');
      }
      const tasks = await Task.find({ email });
      res.json({ tasks });
  } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Route to add a task with email
app.post('/addTask', async (req, res) => {
  try {
      const { taskName, email } = req.body;
      if (!taskName || !email) {
          throw new Error('Task name and email are required');
      }
      const newTask = new Task({ taskName, email });
      const savedTask = await newTask.save();
      res.status(201).json({ task: savedTask });
  } catch (error) {
      console.error('Error adding task:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Route to remove a task with email and taskId
app.post('/removeTask', async (req, res) => {
  try {
      const { taskId, email } = req.body;
      if (!taskId || !email) {
          throw new Error('Task ID and email are required');
      }
      // Assuming taskId is a valid ObjectId
      const result = await Task.deleteOne({ _id: taskId, email });
      if (result.deletedCount === 0) {
          throw new Error('Task not found or unauthorized');
      }
      res.status(200).send('Task removed successfully');
  } catch (error) {
      console.error('Error removing task:', error);
      res.status(500).send('Error removing task');
  }
});



// Route to fetch user registrations excluding the logged-in user's data
app.get('/registrations', async (req, res) => {
  try {
    const loggedInUserEmail = req.headers['user-email'];
    const searchKeyword = req.query.search || ''; // Get search keyword from query params

    // Fetch registrations based on search keyword and excluding logged-in user
    const registrations = await Registration.find({
      email: { $ne: loggedInUserEmail },
      username: { $regex: searchKeyword, $options: 'i' }, // Case-insensitive regex search
    });
    
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Update the route definition to handle DELETE requests
app.delete('/removeUser/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // Perform ObjectId validation here if needed
    // Example: const validUserId = mongoose.Types.ObjectId.isValid(userId);
    
    // Check if userId is in the correct format (ObjectId) before proceeding

    // Assuming userId is a valid ObjectId, proceed with deletion
    const result = await Registration.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      return res.status(404).send('User not found or unauthorized');
    }
    return res.status(200).send('User removed successfully');
  } catch (error) {
    console.error('Error removing user:', error);
    return res.status(500).send('Error removing user');
  }
});


// Define Mongoose Schema for Product
const productSchema = new mongoose.Schema({
  productId: String,
  productName: String,
  company: String,
  description: String,
  quantity: Number,
  productImage: { data: Buffer, contentType: String }, // Store image as Buffer data\
  date: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle product creation including image upload
app.post('/products', upload.single('productImage'), async (req, res) => {
  try {
    const { productId, productName, company, description, quantity } = req.body;
    const productImage = {
      data: req.file.buffer, // Image data as Buffer
      contentType: req.file.mimetype, // Image MIME type
    };

    const newProduct = new Product({
      productId,
      productName,
      company,
      description,
      quantity,
      productImage,
    });

    const savedProduct = await newProduct.save();
    res.status(201).send(savedProduct);
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to fetch product suggestions based on productName
app.get('/fetchProducts', async (req, res) => {
  const { productName } = req.query;
  try {
    const products = await Product.find({
      productName: { $regex: productName, $options: 'i' }, // Case insensitive search
    }).limit(10); // Limiting to 10 results
    res.status(200).send(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Server-side route to serve product images
app.get('/products/images/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findOne({ productId });

    if (!product || !product.productImage || !product.productImage.data) {
      return res.status(404).send('Image not found');
    }

    res.set('Content-Type', product.productImage.contentType);
    res.send(product.productImage.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Server-side route for updating products
app.put('/products/:productId', upload.single('productImage'), async (req, res) => {
  try {
    const productId = req.params.productId;
    const { productName, company, description, quantity } = req.body;
    let productImage = req.file; // New image file, if uploaded

    // Fetch the existing product from the database
    const existingProduct = await Product.findOne({ productId });

    if (!existingProduct) {
      console.log('Product not found');
      return res.status(404).send('Product not found');
    }

    // Update product properties
    existingProduct.productName = productName;
    existingProduct.company = company;
    existingProduct.description = description;
    existingProduct.quantity = quantity;

    // Check if a new image was uploaded
    if (productImage) {
      // Update productImage field with new image data
      existingProduct.productImage = {
        data: productImage.buffer, // Image data as Buffer
        contentType: productImage.mimetype, // Image MIME type
      };
    }

    // Save the updated product back to the database
    const updatedProduct = await existingProduct.save();

    // Product updated successfully, send back the updated product
    console.log('Product updated successfully:', updatedProduct);
    res.status(200).send(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Internal Server Error');
  }
});




app.get('/oldproductdata/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Internal Server Error');
  }
});



/// Requesting 

const moment = require('moment-timezone');

// Define Mongoose Schema
const requestSchema = new mongoose.Schema({
  productName: String,
  reason: String,
  quantity: Number,
  budget: Number,
  status: Number,
  email: String,
  department: String,
  organization: String,
  feedback:String,
  date: { type: String }, // Store date as a string in "YYYY-MM-DD" format
  reqno: { type: String, unique: true }, // Add reqno field as a unique string
});

const Request = mongoose.model('Request', requestSchema);

// API endpoint to handle form submission

app.post('/requests', async (req, res) => {
  try {
    const { productName, reason, quantity, budget, status, email, department, organization, feedback } = req.body;

    // Count the number of existing requests
    const requestCount = await Request.countDocuments({});

    const reqno = `req-${requestCount + 1}`;

    const newRequest = new Request({
      productName,
      reason,
      quantity,
      budget,
      status,
      email,
      department,
      organization,
      feedback,
      date: new Date().toISOString().split('T')[0],
      reqno,
    });

    await newRequest.save();
    res.status(201).json({ message: 'Request added successfully', reqno });
  } catch (error) {
    console.error('Error adding request:', error);
    res.status(500).json({ message: 'Failed to add request' });
  }
});

// API endpoint to fetch requests based on department and organization
app.get('/approval', async (req, res) => {
  try {
    const { department, organization } = req.query;

    // Fetch requests based on department and organization
    const requests = await Request.find({ department, organization });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});




app.get('/requests', async (req, res) => {
  try {
    const { email } = req.query;
    const requests = await Request.find({ email }).sort({ reqno: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});


app.get('/inventory/requests', async (req, res) => {
  try {
    // Fetch requests where status is 1 or 2, sorted by reqno descending
    const filteredProducts = await Request.find({ status: { $in: [1, 2] } })
      .sort({ reqno: -1 }) // Sort by reqno in descending order
      .lean()
      .exec();
    
    res.json(filteredProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.put("/updateRequestStatus", async (req, res) => {
  try {
    const { reqNo, status, feedback } = req.body;
    console.log("Received reqNo:", reqNo); // Log the received reqNo for debugging

    // Update the request status and feedback in the database based on reqNo
    const updatedRequest = await Request.findOneAndUpdate(
      { reqno: reqNo },
      { $set: { status: status, feedback: feedback } }, // Include feedback in the update
      { new: true } // Ensure you get the updated document back
    );

    if (!updatedRequest) {
      console.log("Request not found for reqNo:", reqNo);
      return res.status(404).json({ message: "Request not found" });
    }

    return res.status(200).json({ message: "Request status and feedback updated successfully" });
  } catch (error) {
    console.error("Error updating request status:", error);
    return res.status(500).json({ message: "Failed to update request status and feedback" });
  }
});



// Feedback schema
const feedbackSchema = new mongoose.Schema({
  reqNo: {
    type: String, // Change type to String
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});


const Feedback = mongoose.model('Feedback', feedbackSchema);

app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle feedback submission
app.post('/feedbacks', async (req, res) => {
  try {
    const { reqNo, feedback, email } = req.body;

    // Validate required fields
    if (!reqNo || !feedback || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a new feedback instance
    const newFeedback = new Feedback({ reqNo, feedback, email });
    await newFeedback.save(); // Save the feedback to MongoDB

    // Send a JSON response with success message and additional data if needed
    res.status(201).json({ message: 'Feedback saved successfully', feedbackId: newFeedback._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving feedback' });
  }
});


app.get('/feedback/:reqNo', async (req, res) => {
  const { reqNo } = req.params;
  try {
    const feedback = await Feedback.findOne({ reqNo });
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json({ feedback: feedback.feedback }); // Sending only the feedback text
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});





const transferProductSchema = new mongoose.Schema({
  products: [{
    productName: String,
    quantityTransferred: Number,
    status: { type: Number, default: 0 },
  }],
  email: String,
  reqNo: String,
  date: { type: Date, default: Date.now } // Use `{ type: Date, default: Date.now }` for date field
});

const TransferProduct = mongoose.model('TransferProduct', transferProductSchema);


// API endpoint to fetch all products
app.get('/gettransferedproduct', async (req, res) => {
  try {
    // Fetch products in descending order by reqNo
    const products = await TransferProduct.find({}).sort({ reqNo: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching products' });
  }
});

// Define Mongoose Schema for BuyProduct
const buyProductSchema = new mongoose.Schema({
  products: [{
    productName: String,
    quantityNeeded: Number,
    status: { type: Number, default: 0 },
    description: String,
    link: String
  }],
  email: String,
  reqNo: String,
  date: { type: Date, default: Date.now } // Use `{ type: Date, default: Date.now }` for date field
});

const BuyProduct = mongoose.model('BuyProduct', buyProductSchema);

app.get('/getbuyproduct', async (req, res) => {
  try {
    const products = await BuyProduct.find().sort({ date: -1 }).exec();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

app.post('/getbuyproductmember', async (req, res) => {
  try {
    const { email } = req.body; // Extract email from the request body
    const products = await BuyProduct.find({ email: email }).sort({ date: -1 }).exec();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});


app.put('/buyupdateproduct/:reqNo/:productName', async (req, res) => {
  const { reqNo, productName } = req.params;
  const { link, description } = req.body;

  try {
    // Update the product based on reqNo and productName
    const updatedProduct = await BuyProduct.findOneAndUpdate(
      { reqNo, 'products.productName': productName },
      {
        $set: {
          'products.$.link': link,
          'products.$.description': description,
          'products.$.status': 1, // Set status to 1 during update
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});




// Define Mongoose Schema for ArrangeProduct
const arrangeProductSchema = new mongoose.Schema({
  products: [{
    productName: String,
    quantityNeeded: Number,
    status: { type: Number, default: 0 },
    description: String,
    link: String
  }],
  email: String,
  reqNo: String,
  date: { type: Date, default: Date.now }
});

const ArrangeProduct = mongoose.model('ArrangeProduct', arrangeProductSchema);


app.get('/getarrangeproduct', async (req, res) => {
  try {
    const products = await ArrangeProduct.find().sort({ date: -1 }).exec();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});


// Route to create and save TransferProduct
app.post("/createTransferProduct", async (req, res) => {
  try {
    const { products, email, reqNo } = req.body;

    const transferProduct = new TransferProduct({
      products,
      email,
      reqNo,
      status: 0, // Set status to pending
    });
    await transferProduct.save();
    console.log("Transfer product created and saved successfully");

    return res.status(200).json({ message: "Transfer product created and saved successfully" });
  } catch (error) {
    console.error("Error creating transfer product:", error);
    return res.status(500).json({ message: "Failed to create transfer product", error: error.message });
  }
});

// Route to create and save BuyProduct
app.post("/createBuyProduct", async (req, res) => {
  try {
    const { products, email, reqNo } = req.body;

    const buyProduct = new BuyProduct({
      products,
      email,
      reqNo,
    });
    await buyProduct.save();
    console.log("Buy product created and saved successfully");

    return res.status(200).json({ message: "Buy product created and saved successfully" });
  } catch (error) {
    console.error("Error creating buy product:", error);
    return res.status(500).json({ message: "Failed to create buy product", error: error.message });
  }
});
// Route to create and save BuyProduct
app.post("/createBuyProduct", async (req, res) => {
  try {
    const { productsData, email, reqNo } = req.body;

    const buyProduct = new BuyProduct({
      products: productsData,
      email,
      reqNo,
    });
    await buyProduct.save();
    console.log("Buy product created and saved successfully");

    return res.status(200).json({ message: "Buy product created and saved successfully" });
  } catch (error) {
    console.error("Error creating buy product:", error);
    return res.status(500).json({ message: "Failed to create buy product", error: error.message });
  }
});


// Express route to update request status and handle product transfers
app.put("/updateRequestStatusInv", async (req, res) => {
  try {
    const { reqNo, status, feedback } = req.body;
    console.log("Received reqNo:", reqNo);

    // Find the request based on reqNo
    const request = await Request.findOne({ reqno: reqNo });
    if (!request) {
      console.log("Request not found for reqNo:", reqNo);
      return res.status(404).json({ message: "Request not found" });
    }

    // Extract request details
    const { productName, email, quantity } = request;
    const productRequests = productName.split(",").map(name => name.trim());

    // Track unavailable products and transferred products
    const unavailableProducts = [];
    const transferredProducts = [];

    for (const prodName of productRequests) {
      // Find the product in Product collection
      const product = await Product.findOne({ productName: prodName });
      if (!product) {
        // Product not found, add to BuyProduct
        unavailableProducts.push({ productName: prodName, quantityNeeded: quantity });
      } else {
        // Calculate actual transferred quantity
        let quantityNeeded = quantity; // Assume initially all needed
        let transferredQuantity = 0; // Track transferred quantity

        if (product.quantity >= quantity) {
          transferredQuantity = quantity; // Entire quantity transferred
          product.quantity -= quantity; // Reduce product quantity
        } else {
          transferredQuantity = product.quantity; // Transfer available quantity
          product.quantity = 0; // No quantity left after transfer

          // Product quantity not enough, add to ArrangeProduct
          const remainingQuantity = quantity - transferredQuantity;
          await ArrangeProduct.create({
            products: [{
              productName: prodName,
              quantityNeeded: remainingQuantity,
              status: 0, // Set status as needed
              description: "Insufficient quantity during transfer",
              link: "" // Add relevant link if needed
            }],
            email,
            reqNo,
          });
        }

        // Update transferred products list only if transferredQuantity > 0
        if (transferredQuantity > 0) {
          transferredProducts.push({ productName: prodName, quantityTransferred: transferredQuantity });

          // Save updated product details
          await product.save();
        }
      }
    }

    // Store transferred products in TransferProduct if any transferred
    if (transferredProducts.length > 0) {
      const transferProduct = new TransferProduct({
        products: transferredProducts,
        email,
        reqNo,
        status: 0, // Set status to pending
      });
      await transferProduct.save();
    }

    // Store unavailable products in BuyProduct
    if (unavailableProducts.length > 0) {
      const buyProduct = new BuyProduct({
        products: unavailableProducts,
        email,
        reqNo,
      });
      await buyProduct.save();
    }

    // Update request status and feedback
    await Request.findOneAndUpdate(
      { reqno: reqNo },
      { $set: { status, feedback } },
      { new: true }
    );

    return res.status(200).json({ message: "Request status and feedback updated successfully", transferredProducts, unavailableProducts });
  } catch (error) {
    console.error("Error updating request status:", error);
    return res.status(500).json({ message: "Failed to update request status and feedback", error: error.message });
  }
});

// Route to update product status and handle buying

app.post('/arrange-update-status', async (req, res) => {
  const { reqNo, productName, status } = req.body;

  try {
    // Update status in ArrangeProduct collection
    const updatedProduct = await ArrangeProduct.findOneAndUpdate(
      { reqNo, 'products.productName': productName },
      { $set: { 'products.$.status': status } },
      { new: true }
    );

    console.log('Updated Product:', updatedProduct);

    if (!updatedProduct) {
      throw new Error('Product not found');
    }

    if (status === 2) {
      // If status is 2 (Buy), add to BuyProduct collection with details from ArrangeProduct
      const { email, products } = updatedProduct;
      const productToBuy = products.find(product => product.productName === productName);
      const buyProduct = new BuyProduct({
        email,
        products: [{
          ...productToBuy,
          status: 0 // Set status to 0 when saving to BuyProduct collection
        }],
        reqNo
      });
      await buyProduct.save();
    }

    res.status(200).json({ message: 'Status updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
