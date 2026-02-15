import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, FileText, Users, Zap, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Header from '@/components/layout/Header';
import { analyticsData } from '@/data/mockData';

const metricCards = [
  { label: 'Total Queries', value: analyticsData.totalQueries.toLocaleString(), icon: BarChart3, color: 'text-primary' },
  { label: 'Documents Indexed', value: analyticsData.documentsIndexed.toString(), icon: FileText, color: 'text-success' },
  { label: 'Active Users', value: analyticsData.activeUsers.toString(), icon: Users, color: 'text-accent' },
  { label: 'Avg Response Time', value: analyticsData.avgResponseTime, icon: Zap, color: 'text-warning' },
];

const activityIcons: Record<string, typeof BarChart3> = {
  query: BarChart3,
  upload: FileText,
  error: AlertTriangle,
};

export default function Admin() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metricCards.map((m, i) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className="glass">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{m.label}</p>
                        <p className="text-2xl font-bold mt-1">{m.value}</p>
                      </div>
                      <m.icon className={`h-8 w-8 ${m.color} opacity-60`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Token Usage Chart */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Token Usage Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.tokenUsage}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="input" stroke="hsl(199 89% 48%)" strokeWidth={2} dot={false} name="Input Tokens" />
                  <Line type="monotone" dataKey="output" stroke="hsl(262 83% 58%)" strokeWidth={2} dot={false} name="Output Tokens" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyticsData.recentActivity.map((act) => {
                  const Icon = activityIcons[act.type] || BarChart3;
                  return (
                    <div key={act.id} className="flex items-start gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        act.type === 'error' ? 'bg-destructive/10' : 'bg-secondary'
                      }`}>
                        <Icon className={`h-4 w-4 ${act.type === 'error' ? 'text-destructive' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{act.action}</p>
                        <p className="text-xs text-muted-foreground">{act.user} · {act.time}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Error Log */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" /> Error Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Time</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.errorLog.map((err) => (
                      <TableRow key={err.id}>
                        <TableCell className="text-xs font-mono">{err.timestamp.split(' ')[1]}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-xs font-medium">{err.type}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{err.message}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={err.status === 'resolved' ? 'secondary' : 'destructive'} className="text-xs">
                            {err.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
