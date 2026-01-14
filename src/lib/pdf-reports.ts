"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Extend jsPDF type for autoTable
declare module "jspdf" {
    interface jsPDF {
        lastAutoTable: {
            finalY: number;
        };
    }
}

export interface ReportColumn {
    header: string;
    dataKey: string;
}

export interface ReportOptions {
    title: string;
    subtitle?: string;
    columns: ReportColumn[];
    data: Record<string, unknown>[];
    filename?: string;
    orientation?: "portrait" | "landscape";
    showLogo?: boolean;
    footerText?: string;
}

// Brand colors
const BRAND_NAVY = "#004E7F";
const BRAND_GOLD = "#D4A84B";

/**
 * Generate a PDF report from data
 */
export function generatePDFReport(options: ReportOptions): void {
    const {
        title,
        subtitle,
        columns,
        data,
        filename = "relatorio",
        orientation = "portrait",
        footerText = "Elo 42 - Sistema de Gestão para Igrejas"
    } = options;

    // Create PDF
    const doc = new jsPDF({
        orientation,
        unit: "mm",
        format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header
    doc.setFillColor(BRAND_NAVY);
    doc.rect(0, 0, pageWidth, 30, "F");

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, 18);

    // Subtitle
    if (subtitle) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(subtitle, 14, 25);
    }

    // Date
    doc.setFontSize(10);
    doc.text(
        `Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
        pageWidth - 14,
        18,
        { align: "right" }
    );

    // Logo text (right side)
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(BRAND_GOLD);
    doc.text("ELO 42", pageWidth - 14, 12, { align: "right" });

    // Table
    const tableColumns = columns.map(col => ({
        header: col.header,
        dataKey: col.dataKey
    }));

    autoTable(doc, {
        startY: 40,
        head: [columns.map(col => col.header)],
        body: data.map(row => columns.map(col => String(row[col.dataKey] ?? ""))),
        headStyles: {
            fillColor: BRAND_NAVY,
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: "bold"
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [50, 50, 50]
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250]
        },
        margin: { left: 14, right: 14 },
        theme: "grid",
        styles: {
            cellPadding: 3,
            lineWidth: 0.1,
            lineColor: [200, 200, 200]
        }
    });

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Footer line
        doc.setDrawColor(BRAND_NAVY);
        doc.setLineWidth(0.5);
        doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);

        // Footer text
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.text(footerText, 14, pageHeight - 10);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 14, pageHeight - 10, { align: "right" });
    }

    // Save
    doc.save(`${filename}.pdf`);
}

/**
 * Generate financial report PDF
 */
export function generateFinancialReport(
    transactions: Array<{
        type: string;
        category: string;
        description: string;
        date: string;
        amount: number;
    }>,
    period: string
): void {
    const income = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;

    // Format amounts for display
    const formattedData = transactions.map(t => ({
        ...t,
        amount: t.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        date: new Date(t.date).toLocaleDateString("pt-BR")
    }));

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header
    doc.setFillColor(BRAND_NAVY);
    doc.rect(0, 0, pageWidth, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório Financeiro", 14, 18);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(period, 14, 28);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(BRAND_GOLD);
    doc.text("ELO 42", pageWidth - 14, 15, { align: "right" });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, pageWidth - 14, 28, { align: "right" });

    // Summary cards
    const cardY = 45;
    const cardHeight = 25;
    const cardWidth = (pageWidth - 42) / 3;

    // Income card
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(14, cardY, cardWidth, cardHeight, 3, 3, "F");
    doc.setTextColor(22, 163, 74);
    doc.setFontSize(10);
    doc.text("Receitas", 14 + cardWidth / 2, cardY + 8, { align: "center" });
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(income.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), 14 + cardWidth / 2, cardY + 18, { align: "center" });

    // Expense card
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(14 + cardWidth + 7, cardY, cardWidth, cardHeight, 3, 3, "F");
    doc.setTextColor(220, 38, 38);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Despesas", 14 + cardWidth + 7 + cardWidth / 2, cardY + 8, { align: "center" });
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(expense.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), 14 + cardWidth + 7 + cardWidth / 2, cardY + 18, { align: "center" });

    // Balance card
    const balanceColor = balance >= 0 ? [22, 163, 74] : [220, 38, 38];
    doc.setFillColor(balance >= 0 ? 240 : 254, balance >= 0 ? 253 : 242, balance >= 0 ? 244 : 242);
    doc.roundedRect(14 + (cardWidth + 7) * 2, cardY, cardWidth, cardHeight, 3, 3, "F");
    doc.setTextColor(balanceColor[0], balanceColor[1], balanceColor[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Saldo", 14 + (cardWidth + 7) * 2 + cardWidth / 2, cardY + 8, { align: "center" });
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), 14 + (cardWidth + 7) * 2 + cardWidth / 2, cardY + 18, { align: "center" });

    // Table
    autoTable(doc, {
        startY: cardY + cardHeight + 15,
        head: [["Tipo", "Categoria", "Descrição", "Data", "Valor"]],
        body: formattedData.map(t => [
            t.type === "income" ? "📈 Receita" : "📉 Despesa",
            t.category,
            t.description,
            t.date,
            t.amount
        ]),
        headStyles: {
            fillColor: BRAND_NAVY,
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: "bold"
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [50, 50, 50]
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250]
        },
        columnStyles: {
            4: { halign: "right" }
        },
        margin: { left: 14, right: 14 },
        theme: "grid"
    });

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setDrawColor(BRAND_NAVY);
        doc.setLineWidth(0.5);
        doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.text("Elo 42 - Sistema de Gestão para Igrejas", 14, pageHeight - 10);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 14, pageHeight - 10, { align: "right" });
    }

    doc.save(`relatorio-financeiro-${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * Generate members report PDF
 */
export function generateMembersReport(
    members: Array<{
        name: string;
        email: string;
        phone: string;
        status: string;
        joinDate: string;
    }>
): void {
    const formattedData = members.map(m => ({
        ...m,
        joinDate: new Date(m.joinDate).toLocaleDateString("pt-BR"),
        status: m.status === "active" ? "Ativo" : m.status === "inactive" ? "Inativo" : "Visitante"
    }));

    generatePDFReport({
        title: "Relatório de Membros",
        subtitle: `Total: ${members.length} membros cadastrados`,
        columns: [
            { header: "Nome", dataKey: "name" },
            { header: "E-mail", dataKey: "email" },
            { header: "Telefone", dataKey: "phone" },
            { header: "Status", dataKey: "status" },
            { header: "Data de Entrada", dataKey: "joinDate" }
        ],
        data: formattedData,
        filename: `relatorio-membros-${new Date().toISOString().slice(0, 10)}`
    });
}
