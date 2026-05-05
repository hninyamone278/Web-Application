import {
  Box, Grid, Card, CardMedia, CardContent, CardActions, Typography, Button,
  TextField, Slider, Select, MenuItem, FormControl, InputLabel, Pagination, Chip, CircularProgress, IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

function getProductImages(p) {
  if (p.images && p.images.length > 0) return p.images.map((img) => img.image_url);
  if (p.image_url) return [p.image_url];
  return ['https://placehold.co/400x300?text=Jewellery'];
}

function ProductCardImage({ images, name, onClick }) {
  const [idx, setIdx] = useState(0);
  const prev = useCallback((e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); }, [images.length]);
  const next = useCallback((e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); }, [images.length]);
  return (
    <Box sx={{ width: 400, minWidth: 400, height: '100%', position: 'relative', overflow: 'hidden' }}>
      <CardMedia
        component="img"
        image={images[idx]}
        alt={name}
        sx={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
        onClick={onClick}
      />
      {images.length > 1 && (
        <>
          <IconButton onClick={prev} size="small" sx={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}>
            <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton onClick={next} size="small" sx={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}>
            <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Box sx={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.5 }}>
            {images.map((_, i) => (
              <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: i === idx ? '#d4af37' : 'rgba(255,255,255,0.7)', cursor: 'pointer', transition: 'background-color 0.2s' }} onClick={(e) => { e.stopPropagation(); setIdx(i); }} />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const fetchIdRef = useRef(0);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category_id') || '');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);

  useEffect(() => {
    api.get('/products/categories').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (categoryId) params.set('category_id', categoryId);
    params.set('min_price', priceRange[0]);
    params.set('max_price', priceRange[1]);
    params.set('page', page);
    setSearchParams(params);

    const fetchId = ++fetchIdRef.current;
    api.get(`/products?${params.toString()}`)
      .then((r) => {
        if (fetchId === fetchIdRef.current) {
          setProducts(r.data.products);
          setTotal(r.data.total);
          setPages(r.data.pages);
        }
      })
      .finally(() => { if (fetchId === fetchIdRef.current) setLoading(false); });
  }, [search, categoryId, priceRange, page, setSearchParams]);

  const handleSearchSubmit = (e) => { e.preventDefault(); setLoading(true); setPage(1); };

  return (
    <Box className="max-w-7xl mx-auto px-4 py-8">
      <Typography variant="h4" sx={{ fontFamily: 'serif', mb: 4 }}>Our Collection</Typography>
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        {/* Sidebar Filters */}
        <Box
          sx={{
            width: 260,
            flexShrink: 0,
            position: 'sticky',
            top: 80,
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Box sx={{ p: 2.5, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>Filters</Typography>

            <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 3 }}>
              <TextField
                size="small" fullWidth label="Search" value={search}
                onChange={(e) => { setLoading(true); setSearch(e.target.value); }}
              />
            </Box>

            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
              <InputLabel>Category</InputLabel>
              <Select value={categoryId} label="Category" onChange={(e) => { setLoading(true); setCategoryId(e.target.value); setPage(1); }}>
                <MenuItem value="">All</MenuItem>
                {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>

            <Typography gutterBottom>Price Range: {priceRange[0] >= 1000 ? `${(priceRange[0] / 1000).toLocaleString()}K` : priceRange[0].toLocaleString()} – {priceRange[1] >= 1000 ? `${(priceRange[1] / 1000).toLocaleString()}K` : priceRange[1].toLocaleString()} MMK</Typography>
            <Slider
              value={priceRange} min={0} max={10000000} step={100000}
              onChange={(_, v) => { setLoading(true); setPriceRange(v); setPage(1); }}
              valueLabelDisplay="auto"
              sx={{ color: '#d4af37' }}
            />
          </Box>
        </Box>

        {/* Product Grid */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {total} product{total !== 1 ? 's' : ''} found
          </Typography>
          {loading ? (
            <Box className="flex justify-center py-12"><CircularProgress /></Box>
          ) : (
            <>
              <Grid container spacing={4}>
                {products.map((p) => (
                  <Grid item xs={12} key={p.id}>
                    <Card sx={{ height: 400, width: 800, display: 'flex', flexDirection: 'row', overflow: 'hidden', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                      <ProductCardImage images={getProductImages(p)} name={p.name} onClick={() => navigate(`/products/${p.id}`)} />
                      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                        <CardContent sx={{ flexGrow: 1, cursor: 'pointer', pb: 1, overflow: 'hidden' }} onClick={() => navigate(`/products/${p.id}`)}>
                          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</Typography>
                          {p.category && <Chip label={p.category.name} size="small" sx={{ mb: 0.5 }} />}
                          <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {p.description}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#d4af37' }}>
                            {Math.round(parseFloat(p.price)).toLocaleString()} MMK
                          </Typography>
                          <Button
                            variant="contained" size="small"
                            sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#d4af37', color: '#1a1a2e' } }}
                            disabled={p.stock === 0}
                            onClick={() => addToCart(p)}
                          >
                            {p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </Button>
                        </CardActions>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              {pages > 1 && (
                <Box className="flex justify-center mt-6">
                  <Pagination count={pages} page={page} onChange={(_, v) => { setLoading(true); setPage(v); }} color="primary" />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
