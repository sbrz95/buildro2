-- Seed data for marketplace
-- This script populates the database with initial data for testing

-- Insert default categories
INSERT INTO public.agent_categories (name, description, icon) VALUES
('Support', 'Customer support and service agents', 'MessageSquare'),
('Sales', 'Sales and lead generation agents', 'DollarSign'),
('Marketing', 'Content creation and marketing agents', 'Zap'),
('Analytics', 'Data analysis and reporting agents', 'BarChart3'),
('HR', 'Human resources and recruitment agents', 'Users'),
('Finance', 'Financial planning and analysis agents', 'Calculator')
ON CONFLICT (name) DO NOTHING;

-- Insert sample agents (these would normally be created through the admin interface)
INSERT INTO public.agents (
    id,
    title,
    description,
    price,
    image_url,
    category,
    features,
    tags,
    documentation,
    download_link,
    support_email,
    version,
    rating,
    downloads,
    status
) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Customer Support Pro',
    'Ein fortschrittlicher KI-Agent für professionellen Kundensupport mit Multi-Sprach-Unterstützung und Ticket-Management.',
    29.99,
    '/customer-support-robot.png',
    'Support',
    ARRAY['24/7 Support', 'Multi-Language', 'Ticket Integration'],
    ARRAY['AI', 'Customer Service', 'Automation'],
    'Vollständige Setup-Anleitung und API-Dokumentation verfügbar. Unterstützt REST API und Webhooks.',
    'https://api.buildro.ai/agents/download/customer-support-pro',
    'support@buildro.ai',
    '1.2.0',
    4.8,
    1247,
    'approved'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Sales Assistant Elite',
    'Maximiere deine Verkaufsergebnisse mit diesem intelligenten Sales-Agent, der Leads qualifiziert und Deals abschließt.',
    49.99,
    '/sales-robot-assistant.png',
    'Sales',
    ARRAY['Lead Qualification', 'CRM Integration', 'Deal Closing'],
    ARRAY['Sales', 'CRM', 'Lead Generation'],
    'Integriert sich nahtlos mit gängigen CRM-Systemen. Inklusive Salesforce und HubSpot Connector.',
    'https://api.buildro.ai/agents/download/sales-assistant-elite',
    'support@buildro.ai',
    '2.1.0',
    4.9,
    892,
    'approved'
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'Content Creator Bot',
    'Erstelle hochwertige Inhalte für Social Media, Blogs und Marketing-Kampagnen mit diesem kreativen KI-Agent.',
    39.99,
    '/content-creator-robot.png',
    'Marketing',
    ARRAY['SEO Optimized', 'Multi-Platform', 'Brand Voice'],
    ARRAY['Content', 'SEO', 'Social Media'],
    'Unterstützt über 20 Content-Formate und 15 Social Media Plattformen. Inklusive SEO-Optimierung.',
    'https://api.buildro.ai/agents/download/content-creator-bot',
    'support@buildro.ai',
    '1.5.0',
    4.7,
    2156,
    'approved'
),
(
    '550e8400-e29b-41d4-a716-446655440004',
    'Data Analyst Pro',
    'Analysiere komplexe Datensets und erstelle aussagekräftige Reports mit diesem analytischen KI-Agent.',
    59.99,
    '/data-analyst-robot.png',
    'Analytics',
    ARRAY['Advanced Analytics', 'Report Generation', 'Data Visualization'],
    ARRAY['Analytics', 'Data Science', 'Reporting'],
    'Unterstützt SQL, Python und R. Inklusive Tableau und Power BI Integration.',
    'https://api.buildro.ai/agents/download/data-analyst-pro',
    'support@buildro.ai',
    '3.0.0',
    4.6,
    634,
    'approved'
),
(
    '550e8400-e29b-41d4-a716-446655440005',
    'HR Assistant',
    'Automatisiere HR-Prozesse mit diesem intelligenten Agent für Recruiting und Mitarbeiterverwaltung.',
    34.99,
    '/hr-robot-assistant.png',
    'HR',
    ARRAY['Resume Screening', 'Interview Scheduling', 'Employee Onboarding'],
    ARRAY['HR', 'Recruiting', 'Automation'],
    'Integriert sich mit ATS-Systemen und HR-Software. DSGVO-konform.',
    'https://api.buildro.ai/agents/download/hr-assistant',
    'support@buildro.ai',
    '1.8.0',
    4.5,
    456,
    'approved'
),
(
    '550e8400-e29b-41d4-a716-446655440006',
    'Finance Bot',
    'Verwalte Finanzen und erstelle Berichte mit diesem spezialisierten Finanz-Agent.',
    79.99,
    '/finance-robot-calculator.png',
    'Finance',
    ARRAY['Budget Planning', 'Expense Tracking', 'Financial Reports'],
    ARRAY['Finance', 'Accounting', 'Budgeting'],
    'Unterstützt DATEV und SAP Integration. Automatische Buchhaltung und Steuerberichte.',
    'https://api.buildro.ai/agents/download/finance-bot',
    'support@buildro.ai',
    '2.3.0',
    4.4,
    234,
    'approved'
)
ON CONFLICT (id) DO NOTHING;
