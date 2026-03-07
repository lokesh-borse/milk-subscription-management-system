import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { formatINR } from '../../utils/currency';

const SLOT_LABELS = {
  morning: '6:00 AM - 7:30 AM',
  noon: '12:00 PM - 2:00 PM',
  evening: '6:00 PM - 8:00 PM',
};

const addMonths = (dateString, months) => {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return null;

  const day = d.getDate();
  const result = new Date(d);
  result.setMonth(result.getMonth() + Number(months || 0));

  // Handle month overflow (e.g., Jan 31 -> Mar 3). Bring to end of previous month.
  if (result.getDate() < day) {
    result.setDate(0);
  }

  return result;
};

const fmtDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const SubscriptionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/subscription/subscription/${id}/`);
        setSubscription(res.data);
      } catch {
        setError('Failed to load subscription details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  const endDate = useMemo(() => {
    if (!subscription?.start_date) return null;
    return addMonths(subscription.start_date, subscription.duration || 0);
  }, [subscription]);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="card card-body">Loading subscription details...</div>
        </div>
      </section>
    );
  }

  if (error || !subscription) {
    return (
      <section className="section">
        <div className="container">
          <div className="card card-body" style={{ marginBottom: 12 }}>{error || 'Subscription not found.'}</div>
          <button className="btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </section>
    );
  }

  const outstanding = Number(subscription.outstanding_balance) || 0;
  const paid = Number(subscription.total_paid_amount) || 0;

  return (
    <section className="section">
      <div className="container">
        <div className="actions" style={{ marginBottom: 16 }}>
          <Link className="btn outline" to="/dashboard">Back to Dashboard</Link>
        </div>

        <div className="card card-body" style={{ marginBottom: 16 }}>
          <h2 className="title" style={{ fontSize: '2rem', marginBottom: 8 }}>Subscription Details</h2>
          <p className="subtitle">Order summary and live delivery/billing status for your active plan.</p>
        </div>

        <div className="grid cols-2" style={{ gap: 16 }}>
          <div className="card card-body">
            <div className="muted">Product</div>
            <strong>{subscription.product_name}</strong>
            <div className="muted" style={{ marginTop: 8 }}>Category</div>
            <strong>{subscription.product_category || '-'}</strong>
          </div>

          <div className="card card-body">
            <div className="muted">Daily Quantity</div>
            <strong>{subscription.quantity} unit(s) per day</strong>
            <div className="muted" style={{ marginTop: 8 }}>Status</div>
            <strong style={{ textTransform: 'capitalize' }}>{subscription.status}</strong>
          </div>

          <div className="card card-body">
            <div className="muted">Subscription Duration</div>
            <strong>{subscription.duration} month(s)</strong>
            <div className="muted" style={{ marginTop: 8 }}>
              {fmtDate(subscription.start_date)} - {endDate ? fmtDate(endDate) : '-'}
            </div>
          </div>

          <div className="card card-body">
            <div className="muted">Delivery Schedule</div>
            <strong>{SLOT_LABELS[subscription.delivery_slot] || subscription.delivery_slot || '-'}</strong>
            <div className="muted" style={{ marginTop: 8 }}>Frequency</div>
            <strong style={{ textTransform: 'capitalize' }}>{subscription.frequency || '-'}</strong>
          </div>

          <div className="card card-body" style={{ gridColumn: 'span 2' }}>
            <div className="muted">Delivery Address</div>
            <strong>{subscription.address || '-'}</strong>
          </div>

          <div className="card card-body">
            <div className="muted">Total Paid</div>
            <strong>{formatINR(paid)}</strong>
          </div>

          <div className="card card-body">
            <div className="muted">Outstanding Balance</div>
            <strong>{formatINR(outstanding)}</strong>
            {subscription.status === 'paused' && (
              <div className="muted" style={{ marginTop: 8 }}>
                Subscription paused. Outstanding balance for {subscription.active_days || 0} day(s): {formatINR(outstanding)}.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionDetails;
