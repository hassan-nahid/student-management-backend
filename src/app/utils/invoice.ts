import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";

export interface IInvoiceData {
  transactionId: string;
  subscriptionDate: Date;
  endDate: Date;
  userName: string;
  planName: string;
  totalAmount: number;
}

export const generatePdf = async (
  invoiceData: IInvoiceData
): Promise<Buffer> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers: Uint8Array[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      // ==== Header ====
      doc
        .fillColor("#2E86C1")
        .fontSize(28)
        .font("Helvetica-Bold")
        .text("Subscription Invoice", { align: "center" });
      doc.moveDown(0.5);

      // ==== Line separator ====
      doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();
      doc.moveDown(1);

      // ==== Invoice Info ====
      doc.fontSize(12).fillColor("#000").font("Helvetica");
      doc.text(`Transaction ID:`, 50, doc.y).font("Helvetica-Bold").text(`${invoiceData.transactionId}`, 160, doc.y - 15);
      doc.font("Helvetica").text(`Subscription Date:`, 50, doc.y + 10).font("Helvetica-Bold").text(`${invoiceData.subscriptionDate.toDateString()}`, 160, doc.y - 15);
      doc.font("Helvetica").text(`End Date:`, 50, doc.y + 10).font("Helvetica-Bold").text(`${invoiceData.endDate.toDateString()}`, 160, doc.y - 15);
      doc.font("Helvetica").text(`Customer:`, 50, doc.y + 10).font("Helvetica-Bold").text(`${invoiceData.userName}`, 160, doc.y - 15);

      doc.moveDown(2);

      // ==== Plan Details ====
      doc
        .fontSize(15)
        .fillColor("#444444")
        .font("Helvetica-Bold")
        .text("Plan Details", { underline: true });
      doc.moveDown(0.5);

      doc.fontSize(12).fillColor("#000").font("Helvetica");
      doc.text(`Plan Name:`, 50, doc.y).font("Helvetica-Bold").text(`${invoiceData.planName}`, 160, doc.y - 15);
      doc.font("Helvetica").text(`Total Amount:`, 50, doc.y + 10).font("Helvetica-Bold").text(`${invoiceData.totalAmount.toFixed(2)} BDT`, 160, doc.y - 15);

      doc.moveDown(2);

      // ==== Footer ====
      doc
        .fontSize(12)
        .fillColor("#666666")
        .font("Helvetica-Oblique")
        .text("Thank you for subscribing to our service!", { align: "center" });

      doc.end();
    });
  } catch (error: any) {
    throw new AppError(401, `PDF creation error: ${error.message}`);
  }
};