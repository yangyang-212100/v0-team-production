import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Eye, MousePointer, Clock, Globe, Smartphone, Monitor, Calendar, Download } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">Detailed insights into your performance</p>
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue="30d">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124,563</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                +12.5% vs last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,231</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                +8.2% vs last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3m 24s</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                -2.1% vs last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42.3%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                -5.4% vs last period
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Traffic Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Overview</CardTitle>
                <CardDescription>Website traffic trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="visitors" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="visitors">Visitors</TabsTrigger>
                    <TabsTrigger value="pageviews">Page Views</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                  </TabsList>
                  <TabsContent value="visitors" className="space-y-4">
                    <div className="h-[400px] bg-muted/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Visitors chart would be displayed here</p>
                        <p className="text-sm text-muted-foreground mt-2">Interactive chart with time series data</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="pageviews" className="space-y-4">
                    <div className="h-[400px] bg-muted/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Page views chart would be displayed here</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="sessions" className="space-y-4">
                    <div className="h-[400px] bg-muted/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Sessions chart would be displayed here</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Traffic by device type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Desktop</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">65.2%</span>
                    <Badge variant="secondary">29,456</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Mobile</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">28.7%</span>
                    <Badge variant="secondary">12,987</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Tablet</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">6.1%</span>
                    <Badge variant="secondary">2,788</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { page: "/", views: 12456, percentage: "28.5%" },
                    { page: "/dashboard", views: 8932, percentage: "20.4%" },
                    { page: "/analytics", views: 6543, percentage: "15.0%" },
                    { page: "/settings", views: 4321, percentage: "9.9%" },
                    { page: "/profile", views: 3210, percentage: "7.3%" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.page}</p>
                        <p className="text-xs text-muted-foreground">{item.views.toLocaleString()} views</p>
                      </div>
                      <Badge variant="outline">{item.percentage}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { source: "Direct", visitors: 18432, color: "bg-blue-500" },
                    { source: "Google", visitors: 12987, color: "bg-green-500" },
                    { source: "Social Media", visitors: 8765, color: "bg-purple-500" },
                    { source: "Referral", visitors: 4321, color: "bg-orange-500" },
                    { source: "Email", visitors: 2109, color: "bg-pink-500" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.source}</p>
                        <p className="text-xs text-muted-foreground">{item.visitors.toLocaleString()} visitors</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Real-time Activity */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Real-time Activity</CardTitle>
                <CardDescription>Live visitor activity on your site</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: "User viewed /dashboard", location: "New York, US", time: "2s ago" },
                { action: "User signed up", location: "London, UK", time: "5s ago" },
                { action: "User viewed /analytics", location: "Tokyo, JP", time: "8s ago" },
                { action: "User made purchase", location: "Berlin, DE", time: "12s ago" },
                { action: "User viewed /", location: "Sydney, AU", time: "15s ago" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.location}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
