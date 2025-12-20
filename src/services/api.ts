import { supabase } from '../lib/supabase';
import type {
  User,
  Service,
  Region,
  Currency,
  PricingFactors,
  Quote,
  AuditLog,
} from '../types';

export const api = {
  auth: {
    async signIn(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },

    async signUp(email: string, password: string, username: string) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      if (error) throw error;
      return data;
    },

    async signOut() {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },

    async getCurrentUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data as User | null;
    },
  },

  services: {
    async getAll() {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Service[];
    },

    async getActive() {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data as Service[];
    },

    async getById(id: number) {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as Service | null;
    },

    async create(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('services')
        .insert(service)
        .select()
        .single();
      if (error) throw error;
      await api.audit.log('create', 'service', data.id, service);
      return data as Service;
    },

    async update(id: number, updates: Partial<Service>) {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      await api.audit.log('update', 'service', id, updates);
      return data as Service;
    },

    async delete(id: number) {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await api.audit.log('delete', 'service', id, null);
    },
  },

  regions: {
    async getAll() {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Region[];
    },

    async getActive() {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .eq('active', true)
        .order('name');
      if (error) throw error;
      return data as Region[];
    },

    async getByCode(code: string) {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .eq('code', code)
        .maybeSingle();
      if (error) throw error;
      return data as Region | null;
    },

    async create(region: Omit<Region, 'id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('regions')
        .insert(region)
        .select()
        .single();
      if (error) throw error;
      await api.audit.log('create', 'region', data.id, region);
      return data as Region;
    },

    async update(id: number, updates: Partial<Region>) {
      const { data, error } = await supabase
        .from('regions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      await api.audit.log('update', 'region', id, updates);
      return data as Region;
    },

    async delete(id: number) {
      const { error } = await supabase
        .from('regions')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await api.audit.log('delete', 'region', id, null);
    },
  },

  currencies: {
    async getAll() {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Currency[];
    },

    async getActive() {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .eq('active', true)
        .order('name');
      if (error) throw error;
      return data as Currency[];
    },

    async getByCode(code: string) {
      const { data, error} = await supabase
        .from('currencies')
        .select('*')
        .eq('code', code)
        .maybeSingle();
      if (error) throw error;
      return data as Currency | null;
    },

    async create(currency: Omit<Currency, 'id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('currencies')
        .insert(currency)
        .select()
        .single();
      if (error) throw error;
      await api.audit.log('create', 'currency', data.id, currency);
      return data as Currency;
    },

    async update(id: number, updates: Partial<Currency>) {
      const { data, error } = await supabase
        .from('currencies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      await api.audit.log('update', 'currency', id, updates);
      return data as Currency;
    },

    async delete(id: number) {
      const { error } = await supabase
        .from('currencies')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await api.audit.log('delete', 'currency', id, null);
    },
  },

  pricingFactors: {
    async get() {
      const { data, error } = await supabase
        .from('pricing_factors')
        .select('*')
        .maybeSingle();
      if (error) throw error;
      return data as PricingFactors | null;
    },

    async update(updates: Partial<PricingFactors>) {
      const { data, error } = await supabase
        .from('pricing_factors')
        .update(updates)
        .eq('id', 1)
        .select()
        .single();
      if (error) throw error;
      await api.audit.log('update', 'pricing_factors', 1, updates);
      return data as PricingFactors;
    },
  },

  quotes: {
    async getAll() {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Quote[];
    },

    async getById(id: number) {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as Quote | null;
    },

    async create(quote: Omit<Quote, 'id' | 'created_at' | 'quote_number'>) {
      const { data: quoteNumber } = await supabase.rpc('generate_quote_number');

      const { data, error } = await supabase
        .from('quotes')
        .insert({ ...quote, quote_number: quoteNumber })
        .select()
        .single();
      if (error) throw error;
      await api.audit.log('create', 'quote', data.id, quote);
      return data as Quote;
    },

    async delete(id: number) {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await api.audit.log('delete', 'quote', id, null);
    },
  },

  users: {
    async getAll() {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as User[];
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as User | null;
    },

    async update(id: string, updates: Partial<User>) {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      await api.audit.log('update', 'user', Number(id), updates);
      return data as User;
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await api.audit.log('delete', 'user', Number(id), null);
    },
  },

  audit: {
    async getAll(limit: number = 100, offset: number = 0) {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .range(offset, offset + limit - 1);
      if (error) throw error;
      return data as AuditLog[];
    },

    async log(
      action: string,
      entityType: string,
      entityId: number | null,
      changes: Record<string, unknown> | null
    ) {
      const { data: { session } } = await supabase.auth.getSession();

      const { error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: session?.user?.id || null,
          action,
          entity_type: entityType,
          entity_id: entityId,
          changes,
        });

      if (error) console.error('Failed to log audit:', error);
    },
  },
};
