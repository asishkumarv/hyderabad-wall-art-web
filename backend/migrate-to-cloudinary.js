const { Client } = require('pg');
const { uploadToCloudinary } = require('./src/utils/cloudinary');
require('dotenv').config();

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('Error: DATABASE_URL is not defined in your environment variables.');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database for migration.');

    // 1. Users table (avatar)
    console.log('\n--- Migrating Users avatar ---');
    const usersRes = await client.query('SELECT id, name, avatar FROM users');
    for (const row of usersRes.rows) {
      if (row.avatar && row.avatar.startsWith('data:')) {
        console.log(`Uploading avatar for user: ${row.name || row.id}`);
        try {
          const url = await uploadToCloudinary(row.avatar, 'users');
          await client.query('UPDATE users SET avatar = $1, updated_at = NOW() WHERE id = $2', [url, row.id]);
          console.log('Successfully updated user avatar.');
        } catch (err) {
          console.error(`Failed to upload avatar for user ${row.id}:`, err.message);
        }
      }
    }

    // 2. Services table (images)
    console.log('\n--- Migrating Services images ---');
    const servicesRes = await client.query('SELECT key, label, images FROM services');
    for (const row of servicesRes.rows) {
      if (row.images && Array.isArray(row.images)) {
        let updated = false;
        const newImages = [];
        for (let i = 0; i < row.images.length; i++) {
          const img = row.images[i];
          if (img && img.startsWith('data:')) {
            console.log(`Uploading image ${i + 1} of ${row.images.length} for service: ${row.label}`);
            try {
              const url = await uploadToCloudinary(img, 'services');
              newImages.push(url);
              updated = true;
            } catch (err) {
              console.error(`Failed to upload image for service ${row.key}:`, err.message);
              newImages.push(img); // keep original base64 if it failed, so we don't lose data
            }
          } else {
            newImages.push(img);
          }
        }
        if (updated) {
          await client.query('UPDATE services SET images = $1, updated_at = NOW() WHERE key = $2', [newImages, row.key]);
          console.log(`Successfully updated images for service: ${row.label}`);
        }
      }
    }

    // 3. Gallery table (image_url)
    console.log('\n--- Migrating Gallery image_url ---');
    const galleryRes = await client.query('SELECT id, title, image_url FROM gallery');
    for (const row of galleryRes.rows) {
      if (row.image_url && row.image_url.startsWith('data:')) {
        console.log(`Uploading gallery image: ${row.title || row.id}`);
        try {
          const url = await uploadToCloudinary(row.image_url, 'gallery');
          await client.query('UPDATE gallery SET image_url = $1, updated_at = NOW() WHERE id = $2', [url, row.id]);
          console.log('Successfully updated gallery image URL.');
        } catch (err) {
          console.error(`Failed to upload gallery image ${row.id}:`, err.message);
        }
      }
    }

    // 4. Blogs table (image, gallery_images)
    console.log('\n--- Migrating Blogs image and gallery ---');
    const blogsRes = await client.query('SELECT id, title, image, gallery_images FROM blogs');
    for (const row of blogsRes.rows) {
      let updatedImage = row.image;
      let updatedGallery = row.gallery_images;
      let needsUpdate = false;

      if (row.image && row.image.startsWith('data:')) {
        console.log(`Uploading main image for blog: ${row.title}`);
        try {
          updatedImage = await uploadToCloudinary(row.image, 'blogs');
          needsUpdate = true;
        } catch (err) {
          console.error(`Failed to upload blog image for ${row.id}:`, err.message);
        }
      }

      if (row.gallery_images && Array.isArray(row.gallery_images)) {
        const newGallery = [];
        for (let i = 0; i < row.gallery_images.length; i++) {
          const img = row.gallery_images[i];
          if (img && img.startsWith('data:')) {
            console.log(`Uploading gallery image ${i + 1} for blog: ${row.title}`);
            try {
              const url = await uploadToCloudinary(img, 'blogs');
              newGallery.push(url);
              needsUpdate = true;
            } catch (err) {
              console.error(`Failed to upload blog gallery image ${i} for ${row.id}:`, err.message);
              newGallery.push(img);
            }
          } else {
            newGallery.push(img);
          }
        }
        updatedGallery = newGallery;
      }

      if (needsUpdate) {
        await client.query('UPDATE blogs SET image = $1, gallery_images = $2, updated_at = NOW() WHERE id = $3', [updatedImage, updatedGallery, row.id]);
        console.log(`Successfully updated blog: ${row.title}`);
      }
    }

    // 5. Categories table (image)
    console.log('\n--- Migrating Wallpaper Categories image ---');
    const categoriesRes = await client.query('SELECT id, name, image FROM categories');
    for (const row of categoriesRes.rows) {
      if (row.image && row.image.startsWith('data:')) {
        console.log(`Uploading image for category: ${row.name}`);
        try {
          const url = await uploadToCloudinary(row.image, 'categories');
          await client.query('UPDATE categories SET image = $1, updated_at = NOW() WHERE id = $2', [url, row.id]);
          console.log('Successfully updated category image.');
        } catch (err) {
          console.error(`Failed to upload category image for ${row.id}:`, err.message);
        }
      }
    }

    // 6. Videos table (thumbnail, video_url)
    console.log('\n--- Migrating Videos thumbnail and video_url ---');
    const videosRes = await client.query('SELECT id, title, thumbnail, video_url FROM videos');
    for (const row of videosRes.rows) {
      let updatedThumbnail = row.thumbnail;
      let updatedVideoUrl = row.video_url;
      let needsUpdate = false;

      if (row.thumbnail && row.thumbnail.startsWith('data:')) {
        console.log(`Uploading thumbnail for video: ${row.title}`);
        try {
          updatedThumbnail = await uploadToCloudinary(row.thumbnail, 'videos');
          needsUpdate = true;
        } catch (err) {
          console.error(`Failed to upload video thumbnail for ${row.id}:`, err.message);
        }
      }

      if (row.video_url && row.video_url.startsWith('data:')) {
        console.log(`Uploading video file for video: ${row.title}`);
        try {
          updatedVideoUrl = await uploadToCloudinary(row.video_url, 'videos');
          needsUpdate = true;
        } catch (err) {
          console.error(`Failed to upload video file for ${row.id}:`, err.message);
        }
      }

      if (needsUpdate) {
        await client.query('UPDATE videos SET thumbnail = $1, video_url = $2, updated_at = NOW() WHERE id = $3', [updatedThumbnail, updatedVideoUrl, row.id]);
        console.log(`Successfully updated video: ${row.title}`);
      }
    }

    // 7. Testimonials table (image)
    console.log('\n--- Migrating Testimonials image ---');
    const testimonialsRes = await client.query('SELECT id, name, image FROM testimonials');
    for (const row of testimonialsRes.rows) {
      if (row.image && row.image.startsWith('data:')) {
        console.log(`Uploading image for testimonial: ${row.name}`);
        try {
          const url = await uploadToCloudinary(row.image, 'testimonials');
          await client.query('UPDATE testimonials SET image = $1, updated_at = NOW() WHERE id = $2', [url, row.id]);
          console.log('Successfully updated testimonial image.');
        } catch (err) {
          console.error(`Failed to upload testimonial image for ${row.id}:`, err.message);
        }
      }
    }

    // 8. Settings table (logo)
    console.log('\n--- Migrating Settings logo ---');
    const settingsRes = await client.query('SELECT id, site_name, logo FROM settings WHERE id = 1');
    for (const row of settingsRes.rows) {
      if (row.logo && row.logo.startsWith('data:')) {
        console.log(`Uploading logo for site: ${row.site_name}`);
        try {
          const url = await uploadToCloudinary(row.logo, 'settings');
          await client.query('UPDATE settings SET logo = $1, updated_at = NOW() WHERE id = 1', [url]);
          console.log('Successfully updated settings logo.');
        } catch (err) {
          console.error(`Failed to upload settings logo:`, err.message);
        }
      }
    }

    // 9. Pages content table
    console.log('\n--- Migrating Pages content ---');
    const pagesRes = await client.query('SELECT page_name, content FROM pages');
    for (const row of pagesRes.rows) {
      let content = row.content;
      if (typeof content === 'string') {
        try {
          content = JSON.parse(content);
        } catch (e) {
          // ignore
        }
      }

      // Check if pages content has any base64
      let needsUpdate = false;
      const scanAndUpload = async (obj) => {
        if (obj === null || obj === undefined) return obj;
        if (typeof obj === 'string') {
          if (obj.startsWith('data:')) {
            console.log(`Uploading base64 image found in page: ${row.page_name}`);
            needsUpdate = true;
            return await uploadToCloudinary(obj, `pages_${row.page_name}`);
          }
          return obj;
        }
        if (Array.isArray(obj)) {
          const newArr = [];
          for (const item of obj) {
            newArr.push(await scanAndUpload(item));
          }
          return newArr;
        }
        if (typeof obj === 'object') {
          const newObj = {};
          for (const key of Object.keys(obj)) {
            newObj[key] = await scanAndUpload(obj[key]);
          }
          return newObj;
        }
        return obj;
      };

      const updatedContent = await scanAndUpload(content);
      if (needsUpdate) {
        await client.query(
          'UPDATE pages SET content = $1, updated_at = NOW() WHERE page_name = $2',
          [typeof updatedContent === 'object' ? JSON.stringify(updatedContent) : updatedContent, row.page_name]
        );
        console.log(`Successfully updated content for page: ${row.page_name}`);
      }
    }

    console.log('\n=========================================');
    console.log('Migration completed successfully!');
    console.log('=========================================');

  } catch (err) {
    console.error('Fatal migration error:', err);
  } finally {
    await client.end();
  }
}

migrate();
