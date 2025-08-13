-- 启用 RLS 策略
ALTER TABLE company_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE position_insights ENABLE ROW LEVEL SECURITY;

-- 为 company_data 表创建策略
CREATE POLICY "Enable read access for all users" ON company_data
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON company_data
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON company_data
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON company_data
    FOR DELETE USING (true);

-- 为 position_insights 表创建策略
CREATE POLICY "Enable read access for all users" ON position_insights
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON position_insights
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON position_insights
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON position_insights
    FOR DELETE USING (true); 