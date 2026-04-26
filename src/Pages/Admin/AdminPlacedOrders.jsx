import React, { useEffect, useMemo, useState } from 'react';
import {
    Search,
    Loader2,
    ShoppingBag,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Power,
    PowerOff,
    Mail,
    Calendar,
    Sparkles,
    HelpCircle,
} from 'lucide-react';
import { storeService } from '../../services/storeService';
import { userService } from '../../services/userService';
import {
    daysUntil,
    subscriptionStatus,
    SUBSCRIPTION_PLANS,
    toMillis,
} from '../../constants/subscriptionPlans';

/* ─────────────── status helpers ─────────────── */

const STATUS_META = {
    active: {
        label: 'Active',
        ring: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        Icon: CheckCircle2,
    },
    expiring: {
        label: 'Expiring soon',
        ring: 'bg-amber-50 text-amber-700 ring-amber-200',
        Icon: AlertTriangle,
    },
    expired: {
        label: 'Expired',
        ring: 'bg-red-50 text-red-700 ring-red-200',
        Icon: XCircle,
    },
    unknown: {
        label: 'No expiry on file',
        ring: 'bg-gray-100 text-gray-600 ring-gray-200',
        Icon: HelpCircle,
    },
};

const expiryLabel = (status, days, expiresAt) => {
    if (status === 'unknown') return '—';
    if (status === 'expired') {
        const d = Math.abs(days);
        return `Expired ${d} day${d === 1 ? '' : 's'} ago`;
    }
    if (days === 0) return 'Expires today';
    return `Expiring in ${days} day${days === 1 ? '' : 's'}`;
};

const formatDate = (value) => {
    const ms = toMillis(value);
    if (ms === null) return '—';
    return new Date(ms).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

/* ─────────────── component ─────────────── */

const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'expiring', label: 'Expiring soon' },
    { id: 'expired', label: 'Expired' },
    { id: 'disabled', label: 'Disabled' },
];

const AdminPlacedOrders = () => {
    const [stores, setStores] = useState([]);
    const [usersById, setUsersById] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [busyStoreId, setBusyStoreId] = useState(null);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [storesData, usersData] = await Promise.all([
                storeService.getAllStores(),
                userService.getAllUsers(),
            ]);
            const map = {};
            usersData.forEach((u) => {
                if (u.uid) map[u.uid] = u;
                else if (u.id) map[u.id] = u;
            });
            setStores(storesData);
            setUsersById(map);
        } catch (err) {
            console.error('Failed to load placed orders', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // Join store ↔ owner user once per render so filtering/sorting is cheap.
    const rows = useMemo(() => {
        return stores.map((store) => {
            const owner = store.userId ? usersById[store.userId] : null;
            const expiresAt =
                store.subscriptionExpiresAt ?? owner?.subscriptionExpiresAt ?? null;
            const startedAt =
                store.subscriptionStartsAt ??
                owner?.subscriptionStartsAt ??
                owner?.packageActivatedAt ??
                null;
            const planId =
                store.planId ?? owner?.activePackageId ?? null;
            const planName =
                SUBSCRIPTION_PLANS[Number(planId)]?.name ||
                owner?.activePackageName ||
                store.planName ||
                'No plan';
            const isTrial = Boolean(store.isTrial ?? owner?.isTrial);
            const status = subscriptionStatus(expiresAt);
            const days = daysUntil(expiresAt);
            return {
                ...store,
                owner,
                expiresAt,
                startedAt,
                planId,
                planName,
                isTrial,
                status,
                days,
            };
        });
    }, [stores, usersById]);

    const filtered = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        return rows.filter((r) => {
            // Filter pill
            if (filter === 'disabled' && !r.disabled) return false;
            if (filter !== 'all' && filter !== 'disabled' && r.status !== filter) {
                return false;
            }
            // Search
            if (!q) return true;
            return (
                r.storeName?.toLowerCase().includes(q) ||
                r.storeCity?.toLowerCase().includes(q) ||
                r.owner?.email?.toLowerCase().includes(q) ||
                r.owner?.displayName?.toLowerCase().includes(q) ||
                r.planName?.toLowerCase().includes(q)
            );
        });
    }, [rows, filter, searchTerm]);

    const counts = useMemo(() => {
        const c = { all: rows.length, active: 0, expiring: 0, expired: 0, disabled: 0 };
        rows.forEach((r) => {
            if (r.disabled) c.disabled += 1;
            if (r.status === 'active') c.active += 1;
            if (r.status === 'expiring') c.expiring += 1;
            if (r.status === 'expired') c.expired += 1;
        });
        return c;
    }, [rows]);

    const toggleDisabled = async (store) => {
        const next = !store.disabled;
        const verb = next ? 'disable' : 'enable';
        const ok = window.confirm(
            `${next ? 'Disable' : 'Re-enable'} "${store.storeName}"?\n\n` +
                `${
                    next
                        ? 'The store will be hidden from public listings and its profile page will return a not-found.'
                        : 'The store will appear in public listings again.'
                }`,
        );
        if (!ok) return;

        setBusyStoreId(store.id);
        try {
            await storeService.setStoreDisabled(store.id, next);
            setStores((prev) =>
                prev.map((s) =>
                    s.id === store.id
                        ? { ...s, disabled: next, disabledAt: next ? new Date() : null }
                        : s,
                ),
            );
        } catch (err) {
            console.error(`Failed to ${verb} store`, err);
            alert(`Could not ${verb} the store. Check the console for details.`);
        } finally {
            setBusyStoreId(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Placed Orders
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Every live store with subscription status, expiry, and a kill switch.
                    </p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{counts.all}</span>
                    <span className="text-sm text-gray-500 font-medium">Total stores</span>
                </div>
            </header>

            {/* Stat tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                    { id: 'active', label: 'Active', value: counts.active, color: 'text-emerald-600' },
                    { id: 'expiring', label: 'Expiring soon', value: counts.expiring, color: 'text-amber-600' },
                    { id: 'expired', label: 'Expired', value: counts.expired, color: 'text-red-600' },
                    { id: 'disabled', label: 'Disabled', value: counts.disabled, color: 'text-gray-700' },
                ].map((tile) => (
                    <button
                        key={tile.id}
                        type="button"
                        onClick={() => setFilter(tile.id)}
                        className={`text-left bg-white p-4 rounded-2xl border shadow-sm transition-all ${
                            filter === tile.id
                                ? 'border-black ring-2 ring-black/5'
                                : 'border-gray-100 hover:border-gray-200'
                        }`}
                    >
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            {tile.label}
                        </p>
                        <p className={`text-2xl font-bold mt-1 ${tile.color}`}>{tile.value}</p>
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative grow max-w-md">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search by store, owner email, city, or plan…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {FILTERS.map((f) => (
                        <button
                            key={f.id}
                            type="button"
                            onClick={() => setFilter(f.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                filter === f.id
                                    ? 'bg-black text-white'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {f.label}
                            <span className="ml-1.5 text-[10px] text-gray-400">
                                {counts[f.id] ?? counts.all}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-10 h-10 animate-spin text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">
                            Loading subscriptions…
                        </p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <ShoppingBag size={36} className="mx-auto text-gray-200 mb-3" />
                        <p className="font-medium">No stores match this filter.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-medium">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Store</th>
                                    <th className="px-6 py-4">Owner</th>
                                    <th className="px-6 py-4">Plan</th>
                                    <th className="px-6 py-4">Started</th>
                                    <th className="px-6 py-4">Expiry</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((row) => {
                                    const meta = STATUS_META[row.status] || STATUS_META.unknown;
                                    const StatusIcon = meta.Icon;
                                    const showDisabled = row.disabled;
                                    return (
                                        <tr
                                            key={row.id}
                                            className={`transition-colors ${
                                                showDisabled
                                                    ? 'bg-gray-50/60 hover:bg-gray-50'
                                                    : 'hover:bg-gray-50/50'
                                            }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {row.logoUrl ? (
                                                        <img
                                                            src={row.logoUrl}
                                                            alt=""
                                                            className="w-10 h-10 rounded-xl object-cover border border-gray-100"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                                            {row.storeName?.[0]?.toUpperCase() || '?'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p
                                                            className={`text-sm font-bold ${
                                                                showDisabled ? 'text-gray-500 line-through' : 'text-gray-900'
                                                            }`}
                                                        >
                                                            {row.storeName || 'Untitled store'}
                                                        </p>
                                                        <p className="text-[11px] text-gray-400">
                                                            {row.storeCity || '—'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {row.owner ? (
                                                    <div>
                                                        <p className="text-sm text-gray-900 font-bold">
                                                            {row.owner.displayName || '—'}
                                                        </p>
                                                        <p className="text-[11px] text-gray-400 flex items-center gap-1">
                                                            <Mail size={10} /> {row.owner.email || '—'}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400">No owner linked</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-700">{row.planName}</span>
                                                    {row.isTrial && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[9px] font-bold uppercase tracking-wider ring-1 ring-amber-200">
                                                            <Sparkles size={9} /> Trial
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={11} className="text-gray-300" />
                                                    {formatDate(row.startedAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p
                                                        className={`text-sm font-medium ${
                                                            row.status === 'expired'
                                                                ? 'text-red-600'
                                                                : row.status === 'expiring'
                                                                  ? 'text-amber-600'
                                                                  : 'text-gray-700'
                                                        }`}
                                                    >
                                                        {expiryLabel(row.status, row.days)}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400">
                                                        {formatDate(row.expiresAt)}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5 items-start">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 text-[10px] font-bold uppercase tracking-wider ${meta.ring}`}
                                                    >
                                                        <StatusIcon size={11} />
                                                        {meta.label}
                                                    </span>
                                                    {showDisabled && (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 ring-gray-200 bg-white text-[10px] font-bold uppercase tracking-wider text-gray-700">
                                                            <PowerOff size={11} /> Disabled
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleDisabled(row)}
                                                    disabled={busyStoreId === row.id}
                                                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                                        row.disabled
                                                            ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                                                            : row.status === 'expired'
                                                              ? 'bg-red-600 text-white hover:bg-red-500'
                                                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    } disabled:opacity-60 disabled:cursor-wait`}
                                                >
                                                    {busyStoreId === row.id ? (
                                                        <Loader2 size={13} className="animate-spin" />
                                                    ) : row.disabled ? (
                                                        <Power size={13} />
                                                    ) : (
                                                        <PowerOff size={13} />
                                                    )}
                                                    {row.disabled ? 'Re-enable' : 'Disable'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPlacedOrders;
