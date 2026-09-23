import { Button, Card, CardContent, Input } from '@clinsight/ui';
import { Send } from 'lucide-react';

export default function UserMessagesPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Messages</h2>
        <p className="text-sm text-gray-500">
          Communicate directly with your assigned healthcare providers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
        <Card className="md:col-span-1 overflow-y-auto">
          <CardContent className="p-3 space-y-2">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-[#1565c0]">
                  SJ
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Dr. Sarah Jenkins</h4>
                  <p className="text-xs text-gray-500 truncate">
                    Your metabolic panel looks normal...
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col justify-between h-full">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center font-bold text-xs text-[#1565c0]">
                  SJ
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3.5 max-w-md text-sm text-gray-800">
                  Hello John, I reviewed your latest Comprehensive Metabolic Panel results.
                  Everything is within standard clinical range. Do you have any questions before
                  tomorrow&apos;s call?
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <div className="bg-[#1565c0] text-white rounded-2xl rounded-tr-none p-3.5 max-w-md text-sm">
                  Thank you Dr. Jenkins! Looking forward to reviewing the details on our call
                  tomorrow.
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <Input placeholder="Type your message..." className="flex-1" />
              <Button variant="brand" className="gap-1.5">
                <Send className="h-4 w-4" /> Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
