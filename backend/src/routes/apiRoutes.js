const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const authenticate = require('../middleware/auth');

// Public routes (GET)
router.get('/services', apiController.getServices);
router.get('/gallery-sections', apiController.getGallerySections);
router.get('/gallery', apiController.getGallery);
router.get('/blogs', apiController.getBlogs);
router.get('/categories', apiController.getCategories);
router.get('/videos', apiController.getVideos);
router.get('/testimonials', apiController.getTestimonials);
router.get('/pages', apiController.getPages);
router.get('/settings', apiController.getSettings);

// Public submission routes
router.post('/leads', apiController.createLead);
router.post('/contacts', apiController.createContact);

// Protected routes (Admin only)
router.use(authenticate);

// Services
router.put('/services/:key', apiController.updateService);

// Gallery Sections
router.post('/gallery-sections', apiController.createGallerySection);
router.put('/gallery-sections/:id', apiController.updateGallerySection);
router.delete('/gallery-sections/:id', apiController.deleteGallerySection);

// Gallery
router.post('/gallery', apiController.createGallery);
router.put('/gallery/:id', apiController.updateGallery);
router.delete('/gallery/:id', apiController.deleteGallery);

// Leads
router.get('/leads', apiController.getLeads);
router.put('/leads/:id', apiController.updateLead);
router.delete('/leads/:id', apiController.deleteLead);

// Blogs
router.post('/blogs', apiController.createBlog);
router.put('/blogs/:id', apiController.updateBlog);
router.delete('/blogs/:id', apiController.deleteBlog);

// Categories
router.post('/categories', apiController.createCategory);
router.put('/categories/:id', apiController.updateCategory);
router.delete('/categories/:id', apiController.deleteCategory);

// Videos
router.post('/videos', apiController.createVideo);
router.put('/videos/:id', apiController.updateVideo);
router.delete('/videos/:id', apiController.deleteVideo);

// Testimonials
router.post('/testimonials', apiController.createTestimonial);
router.put('/testimonials/:id', apiController.updateTestimonial);
router.delete('/testimonials/:id', apiController.deleteTestimonial);

// Pages
router.put('/pages/:page_name', apiController.updatePage);

// Settings
router.put('/settings', apiController.updateSettings);

// Activities
router.get('/activities', apiController.getActivities);
router.post('/activities', apiController.createActivity);

// Contacts
router.get('/contacts', apiController.getContacts);
router.delete('/contacts/:id', apiController.deleteContact);

module.exports = router;
