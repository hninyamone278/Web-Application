import {
  Box, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, Alert, Paper, InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useRef, useState } from 'react';
import api from '../../services/api';

const empty = { name: '', description: '', price: '', stock: '', category_id: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  // Multi-image state: each entry is { file: File|null, url: string, preview: string }
  const [imageSlots, setImageSlots] = useState([]);
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const filteredProducts = products.filter((p) => {
    if (filterCategory && p.category_id !== filterCategory) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const load = () => {
    api.get('/admin/products').then((r) => setProducts(r.data));
    api.get('/admin/categories').then((r) => setCategories(r.data));
  };
  useEffect(load, []);

  const handleOpen = (product = null) => {
    setEditId(product?.id || null);
    setForm(product ? { name: product.name, description: product.description || '', price: product.price, stock: product.stock, category_id: product.category_id || '' } : empty);
    // Populate image slots from existing product images
    if (product?.images && product.images.length > 0) {
      setImageSlots(product.images.map((img) => ({ file: null, url: img.image_url, preview: img.image_url })));
    } else if (product?.image_url) {
      setImageSlots([{ file: null, url: product.image_url, preview: product.image_url }]);
    } else {
      setImageSlots([]);
    }
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setForm(empty);
    setImageSlots([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const remaining = 3 - imageSlots.length;
    if (remaining <= 0) { setError('Maximum 3 images allowed'); e.target.value = ''; return; }
    const toAdd = files.slice(0, remaining);

    // Validate each file and collect valid ones via Promise
    const validationPromises = toAdd.map((file) => new Promise((resolve) => {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        setError('Only JPG and PNG images are allowed');
        resolve(null);
        return;
      }
      if (file.size > 1 * 1024 * 1024) {
        setError('Each image must be 1 MB or smaller');
        resolve(null);
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        if (img.width > 800 || img.height > 800) {
          setError('Image dimensions must be 800×800 px or smaller');
          resolve(null);
          return;
        }
        resolve({ file, url: '', preview: URL.createObjectURL(file) });
      };
      img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(null); };
      img.src = objectUrl;
    }));

    Promise.all(validationPromises).then((results) => {
      const validSlots = results.filter(Boolean);
      if (validSlots.length > 0) {
        setError('');
        setImageSlots((prev) => [...prev, ...validSlots].slice(0, 3));
      }
    });
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImageSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setError('');
    if (!form.name || !form.price) { setError('Name and price are required'); return; }
    try {
      // Upload new image files and collect all URLs
      const imageUrls = [];
      for (const slot of imageSlots) {
        if (slot.file) {
          const fd = new FormData();
          fd.append('image', slot.file);
          const uploadRes = await api.post('/admin/upload', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          imageUrls.push(uploadRes.data.url);
        } else if (slot.url) {
          imageUrls.push(slot.url);
        }
      }
      const payload = { ...form, image_url: imageUrls[0] || '', images: imageUrls };
      if (editId) {
        await api.put(`/admin/products/${editId}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }
      handleClose();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/products/${id}`);
      setDeleteConfirm(null);
      load();
    } catch {
      // ignore
    }
  };

  return (
    <Box>
      <Box className="flex justify-between items-center mb-3">
        <Typography variant="h6">Products ({filteredProducts.length})</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}
          sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#d4af37', color: '#1a1a2e' } }}>
          Add Product
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          size="small" placeholder="Search by name..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          sx={{ minWidth: 220 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select value={filterCategory} label="Category" onChange={(e) => setFilterCategory(e.target.value)}>
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>
                  <img src={(p.images && p.images[0]?.image_url) || p.image_url || 'https://placehold.co/50x50?text=J'}
                    alt={p.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                </TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.category?.name || '—'}</TableCell>
                <TableCell align="right">{Math.round(parseFloat(p.price)).toLocaleString()} MMK</TableCell>
                <TableCell align="right">{p.stock}</TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => handleOpen(p)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => setDeleteConfirm(p)}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange} sx={{ mt: 1, mb: 2 }} />
          <TextField fullWidth multiline rows={3} label="Description" name="description" value={form.description} onChange={handleChange} sx={{ mb: 2 }} />
          <Box className="flex gap-2 mb-2">
            <TextField fullWidth label="Price (MMK)" name="price" type="number" value={form.price} onChange={handleChange} />
            <TextField fullWidth label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} />
          </Box>
          {/* Image upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRef.current.click()}
              sx={{ mb: 1 }}
              disabled={imageSlots.length >= 3}
            >
              {imageSlots.length >= 3 ? 'Max 3 Images' : 'Add Image(s)'}
            </Button>
            <Typography variant="caption" display="block" color="text.secondary">
              JPG or PNG only · Max 1 MB · Max 800×800 px · Up to 3 images
            </Typography>
            {imageSlots.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                {imageSlots.map((slot, idx) => (
                  <Box key={idx} sx={{ position: 'relative', display: 'inline-block' }}>
                    <Box
                      component="img"
                      src={slot.preview}
                      alt={`Preview ${idx + 1}`}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid #e0e0e0',
                        display: 'block',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(idx)}
                      sx={{
                        position: 'absolute', top: -8, right: -8,
                        bgcolor: 'error.main', color: '#fff',
                        width: 22, height: 22,
                        '&:hover': { bgcolor: 'error.dark' },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                    {idx === 0 && (
                      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 0.5, color: 'text.secondary' }}>
                        Main
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select name="category_id" value={form.category_id} label="Category" onChange={handleChange}>
              <MenuItem value="">None</MenuItem>
              {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}
            sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#d4af37', color: '#1a1a2e' } }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "{deleteConfirm?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => handleDelete(deleteConfirm?.id)}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
