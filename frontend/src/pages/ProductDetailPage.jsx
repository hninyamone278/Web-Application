import { Box, Typography, Button, Chip, Divider, Snackbar, Alert, CircularProgress, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

function getImages(product) {
  if (product.images && product.images.length > 0) return product.images.map((img) => img.image_url);
  if (product.image_url) return [product.image_url];
  return ['https://placehold.co/600x500?text=Jewellery'];
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { setImgIdx(0); }, [product]);

  if (loading) return <Box className="flex justify-center py-20"><CircularProgress /></Box>;
  if (!product) return null;

  const images = getImages(product);

  const handleAdd = () => {
    addToCart(product);
    setSnack(true);
  };

  return (
    <Box className="max-w-5xl mx-auto px-4 py-10">
      <Box className="flex flex-col md:flex-row gap-8">
        <Box sx={{ flex: 1 }}>
          {/* Main image with arrows */}
          <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
            <img
              src={images[imgIdx]}
              alt={product.name}
              style={{ width: '100%', borderRadius: 8, objectFit: 'cover', maxHeight: 480, display: 'block' }}
            />
            {images.length > 1 && (
              <>
                <IconButton
                  onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                  sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                >
                  <ArrowBackIosNewIcon />
                </IconButton>
                <IconButton
                  onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                  sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </>
            )}
          </Box>
          {/* Thumbnail row */}
          {images.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5, justifyContent: 'center' }}>
              {images.map((src, i) => (
                <Box
                  key={i}
                  component="img"
                  src={src}
                  alt={`${product.name} ${i + 1}`}
                  onClick={() => setImgIdx(i)}
                  sx={{
                    width: 72, height: 72, objectFit: 'cover', borderRadius: 1, cursor: 'pointer',
                    border: i === imgIdx ? '2px solid #d4af37' : '2px solid transparent',
                    opacity: i === imgIdx ? 1 : 0.6,
                    transition: 'opacity 0.2s, border-color 0.2s',
                    '&:hover': { opacity: 1 },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
        <Box sx={{ flex: 1 }}>
          {product.category && <Chip label={product.category.name} sx={{ mb: 1 }} />}
          <Typography variant="h4" sx={{ fontFamily: 'serif', mb: 1 }}>{product.name}</Typography>
          <Typography variant="h4" sx={{ color: '#d4af37', mb: 2 }}>
            {Math.round(parseFloat(product.price)).toLocaleString()} MMK
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            {product.description}
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            {product.stock > 0 ? `${product.stock} in stock` : <span style={{ color: 'red' }}>Out of stock</span>}
          </Typography>
          <Box className="flex gap-3">
            <Button
              variant="contained" size="large" disabled={product.stock === 0}
              sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#d4af37', color: '#1a1a2e' } }}
              onClick={handleAdd}
            >
              Add to Cart
            </Button>
            <Button variant="outlined" size="large" onClick={() => navigate('/products')}>
              Back
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar open={snack} autoHideDuration={2000} onClose={() => setSnack(false)}>
        <Alert severity="success" onClose={() => setSnack(false)}>Added to cart!</Alert>
      </Snackbar>
    </Box>
  );
}
