<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css">
  <link rel="stylesheet" href="style.css">
  <title>Diaspora Demo</title>
</head>
<body>
  <div class="page-container">
    <div class="image-grid">
      <?php for ($i = 1; $i <= 7; $i++) { ?>
        <div class="image-container">
          <img src="image.jpg" alt="Image <?php echo $i; ?>">
          <div class="content-promo__overlay">
            <div class="overlay-circle">
              <svg xmlns="http://www.w3.org/2000/svg" class="content-promo__overlay__svg" width="32" height="32">
                <path d="M15 16V9H8V8h8v8h-1zm2-2V7h-7V6h8v8h-1zM6 10h8v8H6v-8z"></path>
              </svg>
            </div>
          </div>
        </div>
      <?php } ?>
    </div>
  </div>

  <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
  <script src="scripts.js"></script>
</body>
</html>
