import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { prisma } from '../server.js';

const router = express.Router();

// Create order (guest or authenticated)
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { serviceType, description, budget, name, email, phone, paymentMethod } = req.body;

    // Validation
    if (!serviceType || !description || !budget || !name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: req.user?.id || null,
        userName: name,
        userEmail: email,
        userPhone: phone || null,
        serviceType,
        description,
        budget,
        paymentMethod: paymentMethod || 'manual',
        paymentStatus: paymentMethod === 'manual' ? 'pending' : 'pending',
        orderStatus: 'pending'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

// Get user's orders
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Get single order
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.userId !== req.user.id && req.user.githubId !== process.env.ADMIN_GITHUB_ID) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

export default router;
