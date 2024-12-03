using Microsoft.EntityFrameworkCore;
using NamoreirosFinance.Infrastructure.Context;
using Npgsql;

public abstract class BaseTest : IAsyncLifetime
{
    private const string HOST = "localhost";
    private const string USER = "postgres";
    private const string PASSWORD = "root";
    private readonly string _dbName;

    protected readonly AppDbContext _context;

    protected BaseTest()
    {
        _dbName = $"test_db_{Guid.NewGuid():N}";

        var options = new DbContextOptionsBuilder<AppDbContext>().UseNpgsql($"Host={HOST};Database={_dbName};Username={USER};Password={PASSWORD}") //TODO: create a function to get the connection string
                                                                 .Options;

        _context = new AppDbContext(options);
    }

    public async Task InitializeAsync()
    {
        await CreateTestDatabase();
        await _context.Database.MigrateAsync();
    }

    private async Task CreateTestDatabase()
    {
        using var conn = new NpgsqlConnection($"Host={HOST};Database=postgres;Username={USER};Password={PASSWORD}"); //TODO: create a function to get the connection string
        await conn.OpenAsync();

        using var cmdKillConnections = new NpgsqlCommand(
                                           $"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '{_dbName}'",
                                           conn);

        await cmdKillConnections.ExecuteNonQueryAsync();

        using var cmdDropDb = new NpgsqlCommand($"DROP DATABASE IF EXISTS {_dbName}", conn);
        await cmdDropDb.ExecuteNonQueryAsync();

        using var cmdCreateDb = new NpgsqlCommand($"CREATE DATABASE {_dbName}", conn);
        await cmdCreateDb.ExecuteNonQueryAsync();
    }

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();

        using var conn = new NpgsqlConnection($"Host={HOST};Database=postgres;Username={USER};Password={PASSWORD}");
        await conn.OpenAsync();

        using var cmdKillConnections = new NpgsqlCommand(
            $"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '{_dbName}'",
            conn);
        await cmdKillConnections.ExecuteNonQueryAsync();

        using var cmdDropDb = new NpgsqlCommand($"DROP DATABASE IF EXISTS {_dbName}", conn);
        await cmdDropDb.ExecuteNonQueryAsync();
    }
}