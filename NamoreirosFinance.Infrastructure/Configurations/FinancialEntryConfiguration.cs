using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NamoreirosFinance.Domain.Core.Entities.Transaction;

namespace NamoreirosFinance.Infrastructure.Configurations
{
    public class FinancialEntryConfiguration : IEntityTypeConfiguration<FinancialEntry>
    {
        public void Configure(EntityTypeBuilder<FinancialEntry> builder)
        {
            builder.ToTable("financial_entry");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                   .HasColumnName("id")
                   .ValueGeneratedOnAdd();

            builder.Property(x => x.Date)
                   .HasColumnName("date")
                   .IsRequired();

            builder.Property(x => x.Value)
                   .HasColumnName("value")
                   .HasColumnType("decimal(18,2)")
                   .IsRequired();

            builder.Property(x => x.Description)
                   .HasColumnName("description")
                   .HasMaxLength(255);

            builder.Property(x => x.Type)
                   .HasColumnName("type")
                   .IsRequired()
                   .HasConversion<string>();
        }
    }
}
