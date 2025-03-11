import { createClient } from '@supabase/supabase-js';
import { Database } from  './database.types';

const supabaseUrl = 'https://bphkddtrpasvupficmhq.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwaGtkZHRycGFzdnVwZmljbWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzQ3OTYsImV4cCI6MjA1NjgxMDc5Nn0.hk89o7hz8VXvGzHj8Y1hGP0CZNJM_PsGb8MqpsTXo8k';
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
