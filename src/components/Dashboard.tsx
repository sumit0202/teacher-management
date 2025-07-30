import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DecisionGraphType } from "@gorules/jdm-editor";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

const templateData = [
  {
    id: "1",
    name: "Diwali Voucher",
    description: "This is issue voucher template. If user with vpa pays amount before date {{valid_date}} which is more than {{valid_amount}},then issue him voucher worth {{voucher_amount}} which is valid till {{expiry_date}}. This is redemption voucher template. If user with vpa redeems voucher before date {{expiry_date}} then accept it and deduct amount from of that voucher from total payment.",
    category: "Workflow",
    lastUpdated: "2 days ago",
    status: "Active",
    priority: "High"
  },
  {
    id: "2",
    name: "Christmas Voucher",
    description: "This is issue voucher template. If user with vpa pays amount before date {{valid_date}} which is more than {{valid_amount}},then issue him voucher worth {{voucher_amount}} which is valid till {{expiry_date}}. This is redemption voucher template. If user with vpa redeems voucher before date {{expiry_date}} then accept it and deduct amount from of that voucher from total payment.",
    category: "Finance",
    lastUpdated: "1 week ago",
    status: "Active",
    priority: "Medium"
  },
  {
    id: "3",
    name: "New Year Voucher",
    description: "This is issue voucher template. If user with vpa pays amount before date {{valid_date}} which is more than {{valid_amount}},then issue him voucher worth {{voucher_amount}} which is valid till {{expiry_date}}. This is redemption voucher template. If user with vpa redeems voucher before date {{expiry_date}} then accept it and deduct amount from of that voucher from total payment.",
    category: "CRM",
    lastUpdated: "3 days ago",
    status: "Draft",
    priority: "Low"
  },
  {
    id: "4",
    name: "Holi Voucher",
    description: "This is issue voucher template. If user with vpa pays amount before date {{valid_date}} which is more than {{valid_amount}},then issue him voucher worth {{voucher_amount}} which is valid till {{expiry_date}}. This is redemption voucher template. If user with vpa redeems voucher before date {{expiry_date}} then accept it and deduct amount from of that voucher from total payment.",
    category: "CRM",
    lastUpdated: "4 days ago",
    status: "Active",
    priority: "High"
  },
];

const getTemplateGraph = (templateId: string): DecisionGraphType => {
  switch (templateId) {
    case "1": // Approval Workflow (showcases all node types)
      return {
        nodes: [
          {
            id: "start",
            type: "inputNode",
            content: { label: "Start Approval", type: "start" },
            position: { x: 100, y: 100 },
            name: "",
          },
          {
            id: "validate",
            type: "decisionTableNode",
            content: {
              label: "Validation Rules",
              type: "decisionTable",
              hitPolicy: "first",
              inputs: [{ id: "input1", field: "amount", type: "number" }],
              outputs: [{ id: "output1", field: "validation", type: "string" }],
              rules: [
                {
                  id: "rule1",
                  input: { input1: { value: "<=1000" } },
                  output: { output1: { value: "Auto-approved" } },
                },
                {
                  id: "rule2",
                  input: { input1: { value: ">1000" } },
                  output: { output1: { value: "Needs review" } },
                },
              ],
            },
            position: { x: 300, y: 50 },
            name: "",
          },
          {
            id: "route",
            type: "switchNode",
            content: {
              label: "Route Approval",
              type: "switch",
              rules: [
                {
                  id: "case1",
                  condition: 'validation === "Auto-approved"',
                  content: "Auto-approve",
                },
                {
                  id: "case2",
                  condition: 'validation === "Needs review"',
                  content: "Manual review",
                },
              ],
            },
            position: { x: 300, y: 200 },
            name: "",
          },
          {
            id: "calculate",
            type: "functionNode",
            content: {
              label: "Calculate Risk",
              type: "function",
              function: `function calculate(amount) {
                  return amount > 5000 ? 'High' : 'Low';
                }`,
            },
            position: { x: 500, y: 50 },
            name: "",
          },
          {
            id: "check",
            type: "expressionNode",
            content: {
              label: "Check Threshold",
              type: "expression",
              expression: "amount > companyThreshold",
            },
            position: { x: 500, y: 150 },
            name: "",
          },
          {
            id: "final",
            type: "decisionNode",
            content: { label: "Final Decision", type: "decision" },
            position: { x: 700, y: 100 },
            name: "",
          },
          {
            id: "complete",
            type: "outputNode",
            content: { label: "Process Complete", type: "end" },
            position: { x: 900, y: 100 },
            name: "",
          },
        ],
        edges: [
          // Main flow
          {
            id: "e1",
            source: "start",
            target: "validate",
            sourceHandle: "bottom",
            targetHandle: "top",
          },
          {
            id: "e2",
            source: "validate",
            target: "route",
            sourceHandle: "bottom",
            targetHandle: "top",
          },

          // Switch cases
          {
            id: "e3",
            source: "route",
            target: "calculate",
            sourceHandle: "case2",
            targetHandle: "top",
          },
          {
            id: "e4",
            source: "route",
            target: "final",
            sourceHandle: "case1",
            targetHandle: "left",
          },

          // Calculation path
          {
            id: "e5",
            source: "calculate",
            target: "check",
            sourceHandle: "bottom",
            targetHandle: "top",
          },
          {
            id: "e6",
            source: "check",
            target: "final",
            sourceHandle: "right",
            targetHandle: "bottom",
          },

          // Final step
          {
            id: "e7",
            source: "final",
            target: "complete",
            sourceHandle: "right",
            targetHandle: "left",
          },
        ],
      };

    case "2": // Risk Assessment (focus on decision tables)
      return {
        nodes: [
          {
            id: "start",
            type: "inputNode",
            content: { label: "Start Assessment", type: "start" },
            position: { x: 100, y: 100 },
            name: "",
          },
          {
            id: "score",
            type: "decisionTableNode",
            content: {
              label: "Risk Scoring",
              type: "decisionTable",
              hitPolicy: "collect",
              inputs: [
                { id: "i1", field: "creditScore", type: "number" },
                { id: "i2", field: "transactionAmount", type: "number" },
              ],
              outputs: [{ id: "o1", field: "riskScore", type: "number" }],
              rules: [
                {
                  id: "r1",
                  input: { i1: { value: "<600" }, i2: { value: ">1000" } },
                  output: { o1: { value: "100" } },
                },
                {
                  id: "r2",
                  input: { i1: { value: ">=600" }, i2: { value: "<=1000" } },
                  output: { o1: { value: "20" } },
                },
              ],
            },
            position: { x: 300, y: 100 },
            name: "",
          },
          {
            id: "complete",
            type: "outputNode",
            content: { label: "Assessment Complete", type: "end" },
            position: { x: 500, y: 100 },
            name: "",
          },
        ],
        edges: [
          {
            id: "e1",
            source: "start",
            target: "score",
            sourceHandle: "right",
            targetHandle: "left",
          },
          {
            id: "e2",
            source: "score",
            target: "complete",
            sourceHandle: "right",
            targetHandle: "left",
          },
        ],
      };

    case "3": // Customer Onboarding (focus on switch nodes)
      return {
        nodes: [
          {
            id: "start",
            type: "inputNode",
            content: { label: "New Customer", type: "start" },
            position: { x: 100, y: 100 },
            name: "",
          },
          {
            id: "route",
            type: "switchNode",
            content: {
              label: "Route Customer",
              type: "switch",
              rules: [
                {
                  id: "case1",
                  condition: 'customerType === "premium"',
                  content: "Premium flow",
                },
                {
                  id: "case2",
                  condition: 'customerType === "standard"',
                  content: "Standard flow",
                },
              ],
            },
            position: { x: 300, y: 100 },
            name: "",
          },
          {
            id: "premium",
            type: "decisionNode",
            content: { label: "Premium Onboarding", type: "decision" },
            position: { x: 500, y: 50 },
            name: "",
          },
          {
            id: "standard",
            type: "decisionNode",
            content: { label: "Standard Onboarding", type: "decision" },
            position: { x: 500, y: 150 },
            name: "",
          },
          {
            id: "complete",
            type: "outputNode",
            content: { label: "Onboarding Complete", type: "end" },
            position: { x: 700, y: 100 },
            name: "",
          },
        ],
        edges: [
          {
            id: "e1",
            source: "start",
            target: "route",
            sourceHandle: "right",
            targetHandle: "left",
          },
          {
            id: "e2",
            source: "route",
            target: "premium",
            sourceHandle: "case1",
            targetHandle: "top",
          },
          {
            id: "e3",
            source: "route",
            target: "standard",
            sourceHandle: "case2",
            targetHandle: "top",
          },
          {
            id: "e4",
            source: "premium",
            target: "complete",
            sourceHandle: "right",
            targetHandle: "top",
          },
          {
            id: "e5",
            source: "standard",
            target: "complete",
            sourceHandle: "right",
            targetHandle: "bottom",
          },
        ],
      };

    case "4": // Feedback Analysis (focus on function/expression nodes)
    default:
      return {
        nodes: [
          {
            id: "start",
            type: "inputNode",
            content: { label: "Collect Feedback", type: "start" },
            position: { x: 100, y: 100 },
            name: "",
          },
          {
            id: "process",
            type: "functionNode",
            content: {
              label: "Process Feedback",
              type: "function",
              function: `function process(feedback) {
                  const sentiment = analyzeSentiment(feedback.text);
                  return {
                    ...feedback,
                    sentimentScore: sentiment.score,
                    isPositive: sentiment.score > 0.6
                  };
                }`,
            },
            position: { x: 300, y: 50 },
            name: "",
          },
          {
            id: "check",
            type: "expressionNode",
            content: {
              label: "Check Urgency",
              type: "expression",
              expression: "sentimentScore < 0.3 || feedback.rating < 2",
            },
            position: { x: 300, y: 150 },
            name: "",
          },
          {
            id: "route",
            type: "switchNode",
            content: {
              label: "Route Feedback",
              type: "switch",
              rules: [
                {
                  id: "case1",
                  condition: "isUrgent",
                  content: "Priority support",
                },
                {
                  id: "case2",
                  condition: "isPositive",
                  content: "Thank customer",
                },
              ],
            },
            position: { x: 500, y: 100 },
            name: "",
          },
          {
            id: "complete",
            type: "outputNode",
            content: { label: "Analysis Complete", type: "end" },
            position: { x: 700, y: 100 },
            name: "",
          },
        ],
        edges: [
          {
            id: "e1",
            source: "start",
            target: "process",
            sourceHandle: "right",
            targetHandle: "left",
          },
          {
            id: "e2",
            source: "process",
            target: "check",
            sourceHandle: "bottom",
            targetHandle: "top",
          },
          {
            id: "e3",
            source: "check",
            target: "route",
            sourceHandle: "right",
            targetHandle: "left",
          },
          {
            id: "e4",
            source: "route",
            target: "complete",
            sourceHandle: "right",
            targetHandle: "left",
          },
        ],
      };
  }
};

type Template = (typeof templateData)[0];

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Draft":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityStyles(priority)}`}>
      {priority}
    </span>
  );
};

const CategoryIcon = ({ category }: { category: string }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case "Workflow":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "Finance":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case "CRM":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Workflow":
        return "text-purple-600";
      case "Finance":
        return "text-green-600";
      case "CRM":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className={`inline-flex items-center ${getCategoryColor(category)}`}>
      {getIcon(category)}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const handleTemplateClick = (templateId: string) => {
    const templateGraph = getTemplateGraph(templateId);
    navigate("/editor", { state: { initialGraph: templateGraph } });
  };

  const columns = useMemo<ColumnDef<Template>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        cell: (info) => (
          <div className="flex items-center justify-center">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
              {info.getValue() as string}
            </span>
          </div>
        ),
      },
      {
        header: "Template Details",
        accessorKey: "name",
        cell: (info) => (
          <div className="flex items-start space-x-3">
            <CategoryIcon category={info.row.original.category} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-gray-900 truncate">
                {info.getValue() as string}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                  {info.row.original.category}
                </span>
                <StatusBadge status={info.row.original.status} />
              </div>
            </div>
          </div>
        ),
      },
      {
        header: "Description",
        accessorKey: "description",
        cell: (info) => (
          <div className="max-w-xs">
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {(info.getValue() as string).length > 120
                ? `${(info.getValue() as string).substring(0, 120)}...`
                : info.getValue() as string}
            </p>
          </div>
        ),
      },
      {
        header: "Priority",
        accessorKey: "priority",
        cell: (info) => (
          <div className="flex justify-center">
            <PriorityBadge priority={info.getValue() as string} />
          </div>
        ),
      },
      {
        header: "Last Updated",
        accessorKey: "lastUpdated",
        cell: (info) => (
          <div className="text-center">
            <div className="text-sm text-gray-900 font-medium">{info.getValue() as string}</div>
            <div className="text-xs text-gray-500">Modified</div>
          </div>
        ),
      },
      {
        header: "Actions",
        cell: (info) => (
          <div className="flex justify-center">
            <button
              onClick={() => handleTemplateClick(info.row.original.id)}
              className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 border border-transparent rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              title="Open in Editor"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Template
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: templateData,
    columns,
    state: { globalFilter, sorting, pagination },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Decision Templates Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Manage and customize your decision templates with our powerful visual editor
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Templates</p>
                <p className="text-2xl font-semibold text-gray-900">{templateData.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-2xl font-semibold text-gray-900">{templateData.filter(t => t.status === 'Active').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">High Priority</p>
                <p className="text-2xl font-semibold text-gray-900">{templateData.filter(t => t.priority === 'High').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Categories</p>
                <p className="text-2xl font-semibold text-gray-900">{new Set(templateData.map(t => t.category)).size}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Show</span>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {[5, 10, 20, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm font-medium text-gray-700">entries</span>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-2">
                          <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                          <div className="flex flex-col">
                            {{
                              asc: <span className="text-indigo-600">↑</span>,
                              desc: <span className="text-indigo-600">↓</span>,
                            }[header.column.getIsSorted() as string] ?? (
                              <span className="text-gray-400 opacity-50">↕</span>
                            )}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map((row, index) => (
                  <tr 
                    key={row.id} 
                    className={`hover:bg-gray-50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mt-6 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-semibold text-gray-900">
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-gray-900">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-gray-900">
                {table.getFilteredRowModel().rows.length}
              </span>{' '}
              results
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-700">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
              </div>
              
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}