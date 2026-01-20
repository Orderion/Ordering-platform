import express from 'express';
import { requireAdmin } from '../middleware/admin.js';
import { prisma } from '../server.js';

const router = express.Router();

// Get all users
router.get('/users', requireAdmin, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        githubId: true,
        name: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Get all orders
router.get('/orders', requireAdmin, async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.query;
    
    const where = {};
    if (status) where.orderStatus = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        },
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

// Update order status
router.put('/orders/:id/status', requireAdmin, async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const { id } = req.params;

    if (!orderStatus && !paymentStatus) {
      return res.status(400).json({ error: 'At least one status field required' });
    }

    const validOrderStatuses = ['pending', 'paid', 'in_progress', 'completed'];
    const validPaymentStatuses = ['pending', 'paid', 'failed'];

    if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
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

    res.json(order);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Order not found' });
    }
    next(error);
  }
});

// Get dashboard stats
router.get('/stats', requireAdmin, async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalOrders,
      totalRevenue,
      ordersByStatus,
      paymentsByStatus
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.payment.aggregate({
        where: { status: 'success' },
        _sum: { amount: true }
      }),
      prisma.order.groupBy({
        by: ['orderStatus'],
        _count: true
      }),
      prisma.payment.groupBy({
        by: ['status'],
        _count: true,
        _sum: { amount: true }
      })
    ]);

    res.json({
      users: {
        total: totalUsers
      },
      orders: {
        total: totalOrders,
        byStatus: ordersByStatus.reduce((acc, item) => {
          acc[item.orderStatus] = item._count;
          return acc;
        }, {})
      },
      revenue: {
        total: totalRevenue._sum.amount || 0,
        byStatus: paymentsByStatus.reduce((acc, item) => {
          acc[item.status] = {
            count: item._count,
            amount: item._sum.amount || 0
          };
          return acc;
        }, {})
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
